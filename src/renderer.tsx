import renderTip from "bottom-tip";
import mainWgsl from "../shaders/main.wgsl?raw";
import computeWgsl from "../shaders/compute.wgsl?raw";

export const init = async ({ canvas }) => {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "premultiplied",
  });

  const GameOptions = {
    width: (window.innerWidth >> 4) << 4,
    height: (window.innerWidth >> 4) << 4,

    // width: 1024,
    // height: 888,
    timestep: 4,
    workgroupSize: 8,
  };

  const computeShader = device.createShaderModule({ code: computeWgsl });
  const bindGroupLayoutCompute = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "read-only-storage",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "read-only-storage",
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
    ],
  });

  const squareVertices = new Uint32Array([0, 0, 0, 1, 1, 0, 1, 1]);
  const squareBuffer = device.createBuffer({
    size: squareVertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Uint32Array(squareBuffer.getMappedRange()).set(squareVertices);
  squareBuffer.unmap();

  const squareStride: GPUVertexBufferLayout = {
    arrayStride: 2 * squareVertices.BYTES_PER_ELEMENT,
    stepMode: "vertex",
    attributes: [{ shaderLocation: 1, offset: 0, format: "uint32x2" }],
  };

  const vertexShader = device.createShaderModule({ code: mainWgsl });

  vertexShader.getCompilationInfo().then((info) => {
    if (info.messages.length > 0) {
      displayError(info.messages[0].message, mainWgsl, info);
    } else {
      computeShader.getCompilationInfo().then((info) => {
        if (info.messages.length > 0) {
          displayError(info.messages[0].message, computeWgsl, info);
        } else {
          displayError(null, computeWgsl, info);
        }
      });
    }
  });

  let commandEncoder: GPUCommandEncoder;

  const bindGroupLayoutRender = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" },
      },
    ],
  });

  const cellsStride: GPUVertexBufferLayout = {
    arrayStride: Uint32Array.BYTES_PER_ELEMENT,
    stepMode: "instance",
    attributes: [{ shaderLocation: 0, offset: 0, format: "uint32" }],
  };

  let wholeTime = 0,
    loopTimes = 0,
    buffer0: GPUBuffer,
    buffer1: GPUBuffer;
  let render: () => void;
  function resetGameData() {
    // compute pipeline
    const computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayoutCompute],
      }),
      compute: {
        module: computeShader,
        entryPoint: "main",
        constants: { blockSize: GameOptions.workgroupSize },
      },
    });
    const sizeBuffer = device.createBuffer({
      size: 2 * Uint32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.UNIFORM |
        GPUBufferUsage.COPY_DST |
        GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Uint32Array(sizeBuffer.getMappedRange()).set([
      GameOptions.width,
      GameOptions.height,
    ]);
    sizeBuffer.unmap();
    const length = GameOptions.width * GameOptions.height;
    const cells = new Uint32Array(length);
    for (let i = 0; i < length; i++) {
      cells[i] = Math.random() < 0.25 ? 1 : 0;
    }

    buffer0 = device.createBuffer({
      size: cells.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Uint32Array(buffer0.getMappedRange()).set(cells);
    buffer0.unmap();

    buffer1 = device.createBuffer({
      size: cells.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    });

    const bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutCompute,
      entries: [
        { binding: 0, resource: { buffer: sizeBuffer } },
        { binding: 1, resource: { buffer: buffer0 } },
        { binding: 2, resource: { buffer: buffer1 } },
      ],
    });

    const bindGroup1 = device.createBindGroup({
      layout: bindGroupLayoutCompute,
      entries: [
        { binding: 0, resource: { buffer: sizeBuffer } },
        { binding: 1, resource: { buffer: buffer1 } },
        { binding: 2, resource: { buffer: buffer0 } },
      ],
    });

    const renderPipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayoutRender],
      }),
      primitive: {
        topology: "triangle-strip",
      },
      vertex: {
        module: vertexShader,
        entryPoint: "vert_main",
        buffers: [cellsStride, squareStride],
      },
      fragment: {
        module: vertexShader,
        entryPoint: "frag_main",
        targets: [{ format: presentationFormat }],
      },
    });

    let uniformSize = 2 * Uint32Array.BYTES_PER_ELEMENT;
    const uniformBindGroup = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: sizeBuffer, offset: 0, size: uniformSize },
        },
      ],
    });

    loopTimes = 0;
    render = () => {
      console.log("rendering");
      const view = context.getCurrentTexture().createView();
      const renderPass: GPURenderPassDescriptor = {
        colorAttachments: [{ view, loadOp: "clear", storeOp: "store" }],
      };
      commandEncoder = device.createCommandEncoder();

      // compute
      const passEncoderCompute = commandEncoder.beginComputePass();
      passEncoderCompute.setPipeline(computePipeline);
      passEncoderCompute.setBindGroup(0, loopTimes ? bindGroup1 : bindGroup0);
      passEncoderCompute.dispatchWorkgroups(
        GameOptions.width / GameOptions.workgroupSize,
        GameOptions.height / GameOptions.workgroupSize
      );
      passEncoderCompute.end();
      // render
      const passEncoderRender = commandEncoder.beginRenderPass(renderPass);
      passEncoderRender.setPipeline(renderPipeline);
      passEncoderRender.setVertexBuffer(0, loopTimes ? buffer1 : buffer0);
      passEncoderRender.setVertexBuffer(1, squareBuffer);
      passEncoderRender.setBindGroup(0, uniformBindGroup);
      passEncoderRender.draw(4, length);
      passEncoderRender.end();

      device.queue.submit([commandEncoder.finish()]);
    };
  }

  resetGameData();

  (function loop() {
    if (GameOptions.timestep) {
      wholeTime++;
      if (wholeTime >= GameOptions.timestep) {
        render();
        wholeTime -= GameOptions.timestep;
        loopTimes = 1 - loopTimes;
      }
    }

    requestAnimationFrame(loop);
  })();

  return { resetGameData };
};

let displayError = (
  message: string | null,
  code: string,
  info: GPUCompilationInfo
) => {
  if (message == null) {
    renderTip("ok~", "Ok");
  } else {
    console.error(info);
    let before = code.split("\n").slice(0, info.messages[0].lineNum).join("\n");
    let space = " ".repeat(info.messages[0].linePos - 1);
    renderTip("error", before + "\n" + space + "^ " + message);
  }
};
