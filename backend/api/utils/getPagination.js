// Helper function to parse pagination parameters
const getPagination = (page, size) => {
  // Ensure size is a positive integer, default to 10 if invalid or not provided
  const limit = size && parseInt(size, 10) > 0 ? parseInt(size, 10) : 10;
  // Ensure page is a positive integer, default to 1 if invalid or not provided
  const pageNum = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  // Calculate offset
  const offset = (pageNum - 1) * limit;

  return { limit, offset, pageNum }; // Return pageNum for response structure
};

// Helper function to structure the paginated response
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: mentors } = data; // Destructure count and rows from Sequelize's findAndCountAll result
  const currentPage = page;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, mentors, totalPages, currentPage, pageSize: limit };
};
export { getPagination, getPagingData };
