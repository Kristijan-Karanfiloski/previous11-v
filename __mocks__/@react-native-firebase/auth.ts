const mockSendPasswordResetEmail = jest.fn().mockResolvedValue(undefined);

const auth = jest.fn().mockReturnValue({
  sendPasswordResetEmail: mockSendPasswordResetEmail
  // Mock other functions as needed
});

export default auth;
