import React, { useEffect, useRef, useState } from "react";

export default function FingerprintTest() {
    const apiRef = useRef(null);
    const [status, setStatus] = useState("Idle");
    const [deviceInfo, setDeviceInfo] = useState("");
    const [sampleData, setSampleData] = useState("");
    const [qualityInfo, setQualityInfo] = useState("");

    useEffect(() => {
        if (!window.Fingerprint || !window.Fingerprint.WebApi) {
            setStatus("Fingerprint SDK not loaded");
            return;
        }

        const api = new window.Fingerprint.WebApi();
        apiRef.current = api;

        api.onDeviceConnected = (event) => {
            console.log("DeviceConnected", event);
            setStatus("Fingerprint reader connected");
            setDeviceInfo(JSON.stringify(event, null, 2));
        };

        api.onDeviceDisconnected = (event) => {
            console.log("DeviceDisconnected", event);
            setStatus("Fingerprint reader disconnected");
            setDeviceInfo("");
        };

        api.onSamplesAcquired = (event) => {
            console.log("SamplesAcquired", event);
            setStatus("Fingerprint captured successfully");

            try {
                const samples = JSON.parse(event.samples);
                setSampleData(JSON.stringify(samples, null, 2));
            } catch {
                setSampleData(String(event.samples));
            }
        };

        api.onQualityReported = (event) => {
            console.log("QualityReported", event);
            setQualityInfo(JSON.stringify(event, null, 2));
        };

        api.onErrorOccurred = (event) => {
            console.error("ErrorOccurred", event);
            setStatus("Error: " + (event?.message || "Unknown error"));
        };

        api.onCommunicationFailed = (event) => {
            console.error("CommunicationFailed", event);
            setStatus("Communication failed. Check ADC / local agent.");
        };

        api.onAcquisitionStarted = (event) => {
            console.log("AcquisitionStarted", event);
            setStatus("Scanner started. Place your finger on the reader.");
        };

        api.onAcquisitionStopped = (event) => {
            console.log("AcquisitionStopped", event);
            setStatus("Scanner stopped");
        };

        return () => {
            if (apiRef.current) {
                apiRef.current.stopAcquisition().catch(() => {});
            }
        };
    }, []);

    const startScan = async () => {
        try {
            if (!apiRef.current) {
                setStatus("Fingerprint API not initialized");
                return;
            }

            setStatus("Starting scanner...");
            await apiRef.current.startAcquisition(
                window.Fingerprint.SampleFormat.PngImage
            );
        } catch (error) {
            console.error(error);
            setStatus("Failed to start scanner");
        }
    };

    const stopScan = async () => {
        try {
            if (!apiRef.current) return;
            await apiRef.current.stopAcquisition();
            setStatus("Scanner stopped");
        } catch (error) {
            console.error(error);
            setStatus("Failed to stop scanner");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow border">
            <h1 className="text-2xl font-bold mb-4">Fingerprint Reader Test</h1>

            <div className="mb-4">
                <p className="font-semibold">Status:</p>
                <p className="text-blue-600">{status}</p>
            </div>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={startScan}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Start Scan
                </button>

                <button
                    onClick={stopScan}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Stop Scan
                </button>
            </div>

            <div className="mb-4">
                <p className="font-semibold">Device Info:</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {deviceInfo || "No device info yet"}
                </pre>
            </div>

            <div className="mb-4">
                <p className="font-semibold">Quality Info:</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {qualityInfo || "No quality info yet"}
                </pre>
            </div>

            <div>
                <p className="font-semibold">Sample Data:</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                    {sampleData || "No fingerprint captured yet"}
                </pre>
            </div>
        </div>
    );
}
