'use client';

interface QRCodeMockupProps {
  credits: number;
  redemptionCode?: string;
}

export default function QRCodeMockup({ credits, redemptionCode = 'JM-2024-ABCD' }: QRCodeMockupProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-primary-200 max-w-sm mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-neutral-900">Meal Redemption</h3>
        <p className="text-sm text-neutral-600">Show this to partner location</p>
      </div>

      {/* QR Code Mockup */}
      <div className="bg-white p-4 rounded-xl border-2 border-neutral-200 mb-4">
        <div className="aspect-square bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-lg relative overflow-hidden">
          {/* QR Code Pattern Simulation */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`${
                  Math.random() > 0.5 ? 'bg-white' : 'bg-neutral-900'
                } rounded-sm`}
              />
            ))}
          </div>
          
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <div className="text-2xl">🍱</div>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-neutral-200">
          <span className="text-sm text-neutral-600">Credits Available</span>
          <span className="text-lg font-bold text-primary-600">{credits}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-200">
          <span className="text-sm text-neutral-600">Redemption Code</span>
          <span className="text-sm font-mono font-bold text-neutral-900">{redemptionCode}</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-green-800 text-center">
            ✅ Valid at all partner locations
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 bg-gradient-to-r from-primary-500 to-green-500 text-white font-bold py-3 rounded-full hover:shadow-lg transition-all">
        Redeem Now
      </button>
    </div>
  );
}
