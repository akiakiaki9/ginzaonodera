import Header from "./components/header/Header";
import Menu from "./components/menu/Menu";
import Top from "./components/top/Top";
import Values from "./components/values/Values";

export default function Home() {
  return (
    <div>
      <Header />
      <Top />
      <Menu />
      <Values />
    </div>
  );
};