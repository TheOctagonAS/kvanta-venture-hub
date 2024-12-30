import React from 'react';

const CalculatorHeader = () => {
  return (
    <div className="text-center space-y-3 mb-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-nordic-blue to-accent bg-clip-text text-transparent">
        Utforsk Investeringspotensialet
      </h2>
      <p className="text-base text-nordic-gray max-w-xl mx-auto">
        Se hvordan investeringen din kan vokse over tid med eiendomsutleie og verdiøkning
      </p>
    </div>
  );
};

export default CalculatorHeader;