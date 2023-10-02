import "./DrawingPage.css";
import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const interpolate = (start, end, steps) => {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = start.x + t * (end.x - start.x);
        const y = start.y + t * (end.y - start.y);
        points.push({ x, y });
    }
    return points;
};

const DrawingPage = () => {

    const canvasRef = useRef(null);
    let isDrawing = false;

    const handleMouseDown = () => {
        isDrawing = true;
    }

    

    const drawLine = (start, end) => {
        const ctx = canvasRef.current.getContext("2d");
            
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
        {
            return (
                <div>Use a different browser</div>
            );
        }
        const ctx = canvas.getContext("2d");
        const handleMouseUp = () => 
        {
            isDrawing = false;
            lastDrawnPoint = null;
        }
        let lastDrawnPoint = null;

        const draw = (event) => {
            if (!isDrawing)
            {
                return;
            }

            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;

            if (lastDrawnPoint) {
                socket.emit('drawing_line', { start: lastDrawnPoint, end: { x, y } });
                drawLine(lastDrawnPoint, { x, y });
            }
            lastDrawnPoint = { x, y };
            
        }
        

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", handleMouseUp);

        socket.on('start_drawing', (data) => {
            isDrawing = true;
        })


        socket.on('drawing_line', (data) => {
            const interpolatedPoints = interpolate(data.start, data.end, 5);
            for (let i = 0; i < interpolatedPoints.length - 1; i++) {
                drawLine(interpolatedPoints[i], interpolatedPoints[i + 1]);
            }
        });

        
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", handleMouseUp);
            socket.off('drawing_line');
        }
    }, [])

    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear_canvas');
    };

    return (
        <div className = "canvasContainer">
            <canvas className = "canvas" ref = {canvasRef} width="800" height="500">canvas</canvas>
            <button onClick = {clearCanvas}>Clear Canvas</button>
        </div>
    )

}


export default DrawingPage