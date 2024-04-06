import Container from "./components/Container";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


function App() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <div className="over"></div>
      <Container/>
    </QueryClientProvider>
  );
}

export default App;
