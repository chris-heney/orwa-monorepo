import { useUserContext } from "../providers/UserContextProvider";
import ProfileMenu from "./ProfileMenu";

export const Header = () => {
  const { isLoggedIn } = useUserContext();

  return (
    <header className="bg-black px-4 py-3">
      <div className="mx-auto flex max-w-4xl flex-col-reverse items-center justify-between gap-3 md:flex-row">
        <h1 className="text-center text-lg font-semibold tracking-wide text-white sm:text-2xl md:text-left">
          Rural Infrastructure Grant
        </h1>

        <div className="flex items-center gap-4">
          <img
            src="./orwa.webp"
            className="max-h-14 object-contain sm:max-h-16"
            alt="ORWA Logo"
          />
          {isLoggedIn && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
