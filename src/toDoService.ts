function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const todoService = {
  save: async (payload: string) => {
    await delay(100);
    return payload;
  },

  reportBigUsage: async () => {
    await delay(50);
  }
};

export default todoService;
