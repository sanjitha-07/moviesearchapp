// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App




import { useState } from "react";
const API_KEY = "";
const API_URL = "https://www.omdbapi.com/";
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  async function searchMovies(searchText = query, pageNo = 1) {
    if (!searchText.trim()) {
      setError("Please enter a movie name.");
      return;
    }
    setLoading(true);
    setError("");
    setMovies([]);
    try {
      const url =
        `${API_URL}?apikey=${API_KEY}` +
        `&s=${encodeURIComponent(searchText)}` +
        `&page=${pageNo}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        const details = await Promise.all(
          data.Search.map(async (movie) => {
            const result = await fetch(
              `${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`
            );
            return result.json();
          })
        );

        setMovies(details);
        setPage(pageNo);
        setTotalPages(Math.ceil(Number(data.totalResults) / 10));
      } else {
        setError(data.Error || "No movies found.");
        setTotalPages(0);
      }
    } catch {
      setError("Unable to fetch movies. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = movies.filter((movie) => {
    const matchesType =
      filter === "all" || movie.Type === filter;
    const matchesYear =
      year === "" || movie.Year?.startsWith(year);
    return matchesType && matchesYear;
  });

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#fff",
      color: "#111",
      fontFamily: "Arial, sans-serif",
      padding: "30px",
    },
    input: {
      padding: "12px",
      border: "1px solid #111",
      borderRadius: "5px",
      fontSize: "15px",
      minWidth: "180px",
    },
    button: {
      padding: "12px 18px",
      background: "#111",
      color: "#fff",
      border: "1px solid #111",
      borderRadius: "5px",
      cursor: "pointer",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "12px",
      background: "#fff",
    },
  };

  return (
    <div style={styles.page}>
      <header style={{ borderBottom: "2px solid #111", paddingBottom: 20 }}>
        <h1>🎬 Movie Search</h1>
        <p>Discover movies, ratings, directors and more.</p>
      </header>

      <section style={{ marginTop: 25 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchMovies(query, 1);
          }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <input
            style={{ ...styles.input, flex: 1 }}
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button style={styles.button} type="submit">
            Search
          </button>
        </form>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 15,
          }}
        >
          <select
            style={styles.input}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
            <option value="episode">Episodes</option>
          </select>

          <input
            style={styles.input}
            type="number"
            placeholder="Filter by year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </section>

      {loading && <h3>Loading movies...</h3>}

      {error && (
        <p style={{ color: "#b00020", marginTop: 20 }}>{error}</p>
      )}

      {!loading && filteredMovies.length > 0 && (
        <h2 style={{ marginTop: 30 }}>Search Results</h2>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {filteredMovies.map((movie) => (
          <article key={movie.imdbID} style={styles.card}>
            <img
              src={
                movie.Poster && movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://placehold.co/300x420/eeeeee/111111?text=No+Poster"
              }
              alt={movie.Title}
              style={{
                width: "100%",
                height: 300,
                objectFit: "contain",
                background: "#f4f4f4",
              }}
            />

            <h3>{movie.Title}</h3>
            <p><b>Year:</b> {movie.Year}</p>
            <p><b>Genre:</b> {movie.Genre || "N/A"}</p>
            <p><b>Director:</b> {movie.Director || "N/A"}</p>
            <p><b>IMDb Rating:</b> ⭐ {movie.imdbRating || "N/A"}</p>
            <p><b>Awards:</b> {movie.Awards || "N/A"}</p>
            <p><b>Type:</b> {movie.Type || "N/A"}</p>
          </article>
        ))}
      </div>

      {!loading && movies.length > 0 && filteredMovies.length === 0 && (
        <p>No movies match your filters.</p>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
            margin: "30px 0",
          }}
        >
          <button
            style={styles.button}
            disabled={page === 1 || loading}
            onClick={() => searchMovies(query, page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            style={styles.button}
            disabled={page >= totalPages || loading}
            onClick={() => searchMovies(query, page + 1)}
          >
            Next
          </button>
        </div>
      )}

    
        <p>Movie Search Dashboard | Powered by OMDb API</p>
      </footer>
    </div>
  );
}
