void setup() {
    Serial.begin(9600);    // opens serial port, sets data rate to 9600 bps
    Serial.println("READY");
}

void loop() {
  // send data only when you receive data:
  if(Serial.available()) {
   String incoming = Serial.readStringUntil('\n');
   Serial.println(incoming);
  }
}
