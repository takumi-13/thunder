import React from 'react';
import { motion } from 'framer-motion';

interface LightningProps {
  onAnimationComplete: () => void;
}

export const Lightning: React.FC<LightningProps> = ({
  onAnimationComplete,
}) => {
  const numberOfBolts = 300;

  const bolts = Array.from({ length: numberOfBolts }, (_, i) => {
    // ランダムな遅延（0～0.5秒）
    const delay = Math.random() * 0.5;
    // 画面上のランダムな垂直位置（0～100%）
    const topPosition = `${Math.random() * 100}%`;
    // 画面上のランダムな水平位置（0～100%）
    const leftPosition = `${Math.random() * 100}%`;
    // ランダムな幅（5px～15px）
    const width = `${5 + Math.random() * 10}px`;
    // ランダムな高さ（50vh～120vh）※高さを大きくすることで画面全体を覆う印象に
    const height = `${50 + Math.random() * 70}vh`;
    // ランダムな回転（-45度～45度）
    const rotation = Math.random() * 90 - 45;
    // 最後の雷光のアニメーション完了時のみコールバックを呼び出す
    const isLastBolt = i === numberOfBolts - 1;

    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9, rotate: rotation }}
        animate={{ opacity: [0, 1, 0], scale: 1.2 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
        onAnimationComplete={isLastBolt ? onAnimationComplete : undefined}
        style={{
          position: 'fixed',
          top: topPosition,
          left: leftPosition,
          width,
          height,
          background: 'linear-gradient(to bottom, #ffffff, #ffd700)',
          zIndex: 9999,
          pointerEvents: 'none',
          filter: 'blur(1px)', // 微妙なぼかし効果で光のにじみを演出
        }}
      />
    );
  });

  return <>{bolts}</>;
};
