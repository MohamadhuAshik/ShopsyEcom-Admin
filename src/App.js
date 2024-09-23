import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import ProductsScreen from "./pages/ProductsScreen";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from "react";




function App() {
  const [darkMode, setDarkMode] = useState(false)
  const handleChange = () => {
    setDarkMode(!darkMode)
  }
  const Theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  })

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <div className="App">
        <div className="d-flex">
          <div>
            <Sidebar check={darkMode} handleChange={handleChange} />
          </div>

          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<ProductsScreen />} />
          </Routes>

        </div>


      </div>
    </ThemeProvider>
  );
}

export default App;
