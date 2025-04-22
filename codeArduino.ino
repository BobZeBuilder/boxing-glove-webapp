#include <Wire.h>
#include <MPU6050.h>
#include <PulseSensorPlayground.h>

// FSR pins
const int FSR_INDEX = A0;
const int FSR_MIDDLE = A1;
const int FSR_IMPACT = A2;

// Heart rate sensor pin
const int HEART_PIN = A3;

// Sensor objects
MPU6050 mpu;
PulseSensorPlayground pulseSensor;

void setup() {
  Serial.begin(9600);
  Wire.begin();

  // Initialize MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("{\"error\": \"MPU6050 not connected\"}");
  }

  // Initialize PulseSensor
  pulseSensor.analogInput(HEART_PIN);
  pulseSensor.setThreshold(550);  // Adjust if needed
  pulseSensor.begin();
}

void loop() {
  // FSR readings
  int fsrIndex = analogRead(FSR_INDEX);
  int fsrMiddle = analogRead(FSR_MIDDLE);
  int fsrImpact = analogRead(FSR_IMPACT);

  // Accelerometer readings
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);
  float x = ax / 16384.0;
  float y = ay / 16384.0;
  float z = az / 16384.0;

  // Heart rate
  int bpm = pulseSensor.getBeatsPerMinute();

  // Output as JSON
  Serial.print("{\"fsrIndex\":"); Serial.print(fsrIndex); Serial.print(",");
  Serial.print("\"fsrMiddle\":"); Serial.print(fsrMiddle); Serial.print(",");
  Serial.print("\"fsrImpact\":"); Serial.print(fsrImpact); Serial.print(",");
  Serial.print("\"accelerometer\":{\"x\":"); Serial.print(x, 2); Serial.print(",");
  Serial.print("\"y\":"); Serial.print(y, 2); Serial.print(",");
  Serial.print("\"z\":"); Serial.print(z, 2); Serial.print("},");
  Serial.print("\"heartRate\":"); Serial.print(bpm);
  Serial.println("}");

  delay(100);  // adjust as needed
}
