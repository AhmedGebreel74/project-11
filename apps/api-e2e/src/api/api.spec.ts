import axios from 'axios';

describe('GET /v1', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/v1`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});
