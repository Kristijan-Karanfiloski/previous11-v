import { useCallback, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

const useComponentLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    setLayout(layout);
  }, []);

  return [layout, onLayout];
};

export default useComponentLayout;
