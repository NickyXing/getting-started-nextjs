import Header from "../components/Header";

export default function IndexPage() {
  return (
    <>
      <Header />
      <iframe src="/term.html" width="100%" style={{ height: "100vh", border: "none" }} className="pt-16 " />
    </>
  );
}
