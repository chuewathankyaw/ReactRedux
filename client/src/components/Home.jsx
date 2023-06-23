import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="">
      <div className="">
        <h2 className="text-center font-semibold text-3xl">Home</h2>
        <Link to="/login" className="text-center">
          <button className="border-black border-2">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
