const TestBanner = ({ val }: { val: React.ReactNode }) => {
  return (
    <div className="flex items-center w-full justify-center font-bold text-white bg-orange-600">
      {val}
    </div>
  );
};

export default TestBanner;
