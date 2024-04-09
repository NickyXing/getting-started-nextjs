import dynamic from "next/dynamic";
import Header from "../components/Header";

const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <div>
      <Header></Header>
      <div style={{height: '64px'}}></div>
      <Editor />
    </div>
  );
}
