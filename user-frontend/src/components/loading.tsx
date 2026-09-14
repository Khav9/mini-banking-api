import LoadingLottie from "@/assets/lotties/icons8-loading.json";
import Lottie from "lottie-react";
const Loading = () => {
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
      <Lottie
        animationData={LoadingLottie}
        loop={true}
        className="h-[50px] w-[50px]"
      />
    </div>
  );
};

export default Loading;
