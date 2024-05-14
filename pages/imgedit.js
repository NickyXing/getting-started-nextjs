import dynamic from "next/dynamic";
import Header from "../components/Header";
import Head from "next/head";

const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <div>
      <Head>
        <title>
          Fancyimg - Edit your image free with Fancyimg!
        </title>
        <meta
          name="keywords"
          content="image editor, image editor online, image resizer, free image tool"
        />
        <meta
          name="description"
          content="lets you effortlessly transform ideas into stunning visuals. Harness a comprehensive toolkit to elevate your work, captivate audiences, and unleash your creative vision. Totally free!"
        />
      </Head>
      <Header></Header>
      <div style={{height: '64px'}}></div>
      <Editor />
    </div>
  );
}
