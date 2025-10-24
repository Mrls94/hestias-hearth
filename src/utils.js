export const mergeIngredients = (list) => {
  const counts = {};
  list.forEach((item) => {
    if (item && item.name) {
      const key = item.name.toLowerCase().trim();
      counts[key] = (counts[key] || 0) + (item.quantity || 1);
    } else if (typeof item === "string") {
      const key = item.toLowerCase().trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([name, qty]) => ({
    name,
    quantity: qty,
  }));
};