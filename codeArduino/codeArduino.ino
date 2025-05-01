#include <Wire.h>
#include <MPU6050.h>
#include <SparkFun_Bio_Sensor_Hub_Library.h>

// === Pin Definitions ===
#define FSR_INDEX A0
#define FSR_MIDDLE A1
#define FSR_IMPACT A2
#define RESET_PIN 4
#define MFIO_PIN 5

// === Sensor Objects ===
MPU6050 mpu;
SparkFun_Bio_Sensor_Hub bioHub(RESET_PIN, MFIO_PIN);
bioData body;

// === Setup ===
void setup() {
  Serial.begin(115200);
  Wire.begin();

  // --- Initialize MPU6050 ---
  mpu.initialize();
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2); // ±2g range
  mpu.setSleepEnabled(false);                     // Wake up sensor

  if (!mpu.testConnection()) {
    Serial.println("{\"error\": \"MPU6050 not connected\"}");
  }

  // --- Initialize MAX30101 ---
  if (bioHub.begin() == 0) {
    Serial.println("MAX30101 sensor started");
  } else {
    Serial.println("{\"error\": \"MAX30101 not detected\"}");
  }

  if (bioHub.configBpm(MODE_ONE) == 0) {
    Serial.println("MAX30101 configured");
  } else {
    Serial.println("{\"error\": \"MAX30101 config failed\"}");
  }

  delay(4000); // Allow MAX30101 to stabilize
}

// === Main Loop ===
void loop() {
  // === Read FSR sensors ===
  int fsrIndex  = analogRead(FSR_INDEX);
  int fsrMiddle = analogRead(FSR_MIDDLE);
  int fsrImpact = analogRead(FSR_IMPACT);

  // === Read Accelerometer ===
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);

  const float accelScale = 16384.0; // MPU6050 scale for ±2g
  float x = (float)ax / accelScale;
  float y = (float)ay / accelScale;
  float z = (float)az / accelScale;

  // === Read Pulse Oximeter ===
  body = bioHub.readBpm();
  int bpm = body.heartRate;
  int confidence = body.confidence;
  int oxygen = body.oxygen;

  // === Output JSON to Serial ===
  Serial.print("{");
  Serial.print("\"fsrIndex\":");      Serial.print(fsrIndex);    Serial.print(",");
  Serial.print("\"fsrMiddle\":");     Serial.print(fsrMiddle);   Serial.print(",");
  Serial.print("\"fsrImpact\":");     Serial.print(fsrImpact);   Serial.print(",");
  Serial.print("\"accelerometer\":{");
  Serial.print("\"x\":");             Serial.print(x, 2);        Serial.print(",");
  Serial.print("\"y\":");             Serial.print(y, 2);        Serial.print(",");
  Serial.print("\"z\":");             Serial.print(z, 2);        Serial.print("},");
  Serial.print("\"heartRate\":");     Serial.print(bpm);         Serial.print(",");
  Serial.print("\"confidence\":");    Serial.print(confidence);  Serial.print(",");
  Serial.print("\"SpO2\":");          Serial.print(oxygen);
  Serial.println("}");

  delay(100); // 1 sample per second
}
