void setup()
{
  Serial.begin(9600); // USB is always 12 Mbit/sec
}

void loop()
{
  Serial.println("Hello World...");
  delay(1000);  // do not print too fast!
}
