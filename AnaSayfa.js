import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

const AnaSayfa = () => {
  const [initialTimes, setInitialTimes] = useState(25);
  const [leftTimes, setLeftTimes] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Sayaç Mantığı
  useEffect(() => {
    let interval = null;

    if (isActive && leftTimes > 0) {
      interval = setInterval(() => {
        setLeftTimes((prevTime) => prevTime - 1);
      }, 1000);
    } else if (leftTimes === 0) {
      setIsActive(false);
      alert("Süre Doldu!");
    }

    return () => clearInterval(interval);
  }, [isActive, leftTimes]);

  // Süreyi 25:00 formatına çeviren fonksiyon
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Buton Fonksiyonları
  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setLeftTimes(initialTimes * 60);
  };

  const changeTime = (amount) => {
    if (!isActive) {
      const newTime = initialTimes + amount;
      if (newTime > 0) {
        setInitialTimes(newTime);
        setLeftTimes(newTime * 60);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>AnaSayfa</Text>

      {/* Sayaç Göstergesi */}
      <Text>{formatTime(leftTimes)}</Text>

      {/* Süre Ayarlama (+/-) */}
      <View>
        <TouchableOpacity onPress={() => changeTime(+1)}>
          <Text>+1 dk</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeTime(-1)}>
          <Text>-1 dk</Text>
        </TouchableOpacity>
      </View>

      {/* Kontrol Butonları */}
      <View>
        {!isActive ? (
          <TouchableOpacity onPress={handleStart}>
            <Text>Başlat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePause}>
            <Text>Duraklat</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleReset}>
          <Text>Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AnaSayfa

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})