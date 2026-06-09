import { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4">
    </div>
  );
}

export default App;
