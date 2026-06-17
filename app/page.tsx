import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer"
export default function Home() {
  return (
    <>
    <div className="bg-[#fbf9f7]">
      <Navbar/>
      <Hero/>
      <Footer/>
    </div>
    </>
  );
}
