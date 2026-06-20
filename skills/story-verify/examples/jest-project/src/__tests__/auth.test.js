// Test example for story-verify: jest project
// Used as input fixture to verify skill detects jest and runs tests

describe('Authentication', () => {
  test('login returns token on valid credentials', () => {
    const result = { token: 'abc123', userId: 1 };
    expect(result.token).toBeTruthy();
    expect(result.userId).toBe(1);
  });

  test('login throws on invalid credentials', () => {
    const attemptLogin = () => { throw new Error('invalid_credentials'); };
    expect(attemptLogin).toThrow('invalid_credentials');
  });
});
