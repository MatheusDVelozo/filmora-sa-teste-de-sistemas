
export const validateMovie = (movie) => {
 
  if (!movie.title || !movie.sinopse || !movie.release_date) {
    throw new Error("Missing required fields");
  }


  if (typeof movie.release_date !== "date") {
    throw new Error("Release date must be a date");
  }


  return true;
};
