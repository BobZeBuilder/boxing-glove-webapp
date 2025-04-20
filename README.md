# Serial Monitor UI

A clean, modular serial monitor UI for Arduino boxing glove sensors using Next.js and shadcn/ui components.

## Project Structure

- `app/page.tsx` - Main dashboard page
- `components/` - UI components for displaying sensor data
- `hooks/use-serial-data.ts` - Hook for handling serial data connection
- `server/serial-server.js` - Node.js server for serial communication

## Getting Started

### 1. Install dependencies

\`\`\`bash
# Install frontend dependencies
npm install

# Install server dependencies
npm install serialport ws express cors
\`\`\`

### 2. Start the backend server

\`\`\`bash
# Set the correct serial port for your Arduino
# On Windows it might be COM3, COM4, etc.
# On Mac/Linux it might be /dev/ttyUSB0 or /dev/ttyACM0
SERIAL_PORT=COM3 BAUD_RATE=115200 node server/serial-server.js
\`\`\`

### 3. Start the frontend

\`\`\`bash
npm run dev
\`\`\`

### 4. Open the application

Open your browser and navigate to `http://localhost:3000`

## Features

- **Real-time Data Display**: View heart rate, force sensors, and accelerometer data
- **Raw Data Viewer**: See the raw JSON data coming from your device
- **Debug Panel**: Troubleshoot connection and data issues
- **Mock Data**: Test the UI without a physical device
- **Connection Management**: Connect, disconnect, and monitor connection status

## Expected Arduino Data Format

The monitor expects JSON data from the Arduino in this format:

\`\`\`json
{
  "heartRate": 75,
  "fsrIndex": 512,
  "fsrMiddle": 300,
  "fsrImpact": 800,
  "accelerometer": {
    "x": 0.5,
    "y": -1.2,
    "z": 9.8
  },
  "punchCount": 12
}
\`\`\`

## Debugging Tips

1. Use the "Debug" tab to see the current state and connection details
2. Check the "Raw Data" tab to verify the data format from your Arduino
3. If no connection is available, use "Toggle Mock Data" to test the UI
4. Check the server console for serial port errors
