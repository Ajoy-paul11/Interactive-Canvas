import React, { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";

const InteractiveCanvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState("#000000");
  const historyRef = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#f0f0f0",
      });
      setCanvas(newCanvas);

      return () => {
        newCanvas.dispose();
      };
    }
  }, []);

  const addText = () => {
    if (canvas) {
      const text = new IText("Type here", {
        left: 100,
        top: 100,
        fontFamily: "Arial",
        fill: color,
        fontSize: 20,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      updateHistory();
    }
  };

  const changeTextSize = (delta) => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        activeObject.set("fontSize", activeObject.fontSize + delta);
        canvas.renderAll();
        updateHistory();
      }
    }
  };

  const updateHistory = () => {
    if (canvas) {
      const newHistory = [
        ...historyRef.current.slice(0, historyIndex + 1),
        canvas.toJSON().objects,
      ];
      historyRef.current = newHistory;
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      canvas.loadFromJSON(
        { objects: historyRef.current[historyIndex - 1] },
        canvas.renderAll.bind(canvas)
      );
    }
  };

  const redo = () => {
    if (historyIndex < historyRef.current.length - 1) {
      setHistoryIndex(historyIndex + 1);
      canvas.loadFromJSON(
        { objects: historyRef.current[historyIndex + 1] },
        canvas.renderAll.bind(canvas)
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="mb-5 space-x-2">
        <button
          onClick={addText}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Text
        </button>
        <button
          onClick={() => changeTextSize(2)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Increase Size
        </button>
        <button
          onClick={() => changeTextSize(-2)}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Decrease Size
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-1 border rounded"
        />
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= historyRef.current.length - 1}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redo
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-md shadow-md"
      />
    </div>
  );
};

export default InteractiveCanvas;
