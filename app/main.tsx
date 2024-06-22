import { useViewportMode } from "./useViewportMode";
import { Briefcase, BriefcaseProps } from "./briefcase";

export type MainProps = {
  briefcases: BriefcaseProps[];
  urlState: {
    url: string;
    setUrl: (url: string) => void;
  };
  onSubmit: () => void;
};

export function Main({ briefcases, urlState, onSubmit }: MainProps) {
  const viewportMode = useViewportMode();

  const gridClassName = {
    "mobile-portrait": "grid grid-cols-4 gap-2",
    "mobile-landscape": "grid grid-cols-6 gap-4",
    "tablet-portrait": "grid grid-cols-2 gap-4",
    "tablet-landscape": "grid grid-cols-3 gap-4",
    desktop: "grid grid-cols-5 gap-4",
  }[viewportMode];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div>
        <form className="flex items-center justify-center space-x-2">
          <input
            name="wishlist"
            type="text"
            placeholder="Wishlist URL"
            onChange={(e) => urlState.setUrl(e.target.value)}
            value={urlState.url}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={async (e) => {
              e.preventDefault();
              onSubmit();
            }}
          ></button>
        </form>
      </div>
      <div className={gridClassName}>
        {briefcases.map((props) => (
          <Briefcase {...props} key={props.key} />
        ))}
      </div>
    </main>
  );
}
