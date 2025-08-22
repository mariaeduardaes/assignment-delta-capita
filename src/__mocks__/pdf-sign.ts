export class MockRequest {
  private fd: FormData;
  constructor(fd: FormData) {
    this.fd = fd;
  }
  async formData() {
    return this.fd;
  }
}