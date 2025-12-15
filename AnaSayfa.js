import { StyleSheet, View, AppState, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as SQLite from 'expo-sqlite';

import Kategori from './components/Kategori';
import Sayac from './components/Sayac';
import Butonlar from './components/Butonlar';

const db = SQLite.openDatabaseSync('pomodoro.db');

const AnaSayfa = () => {
  const [value, setValue] = useState(null); 
  const [items, setItems] = useState([
    {label: 'Ders Çalışma', value: 'Ders Çalışma'},
    {label: 'Kodlama', value: 'Kodlama'},
    {label: 'Proje Geliştirme', value: 'Proje Geliştirme'},
    {label: 'Kitap Okuma', value: 'Kitap Okuma'},
    {label: 'Diğer', value: 'Diğer'}
  ]);
  const [initialTimes, setInitialTimes] = useState(25);
  const [leftTimes, setLeftTimes] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);


  useEffect(() => {
    async function setupDatabase() {
      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS seanslar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kategori TEXT NOT NULL,
            sure INTEGER NOT NULL,
            tarih TEXT NOT NULL,
            dikkat_daginikligi INTEGER NOT NULL
        )`);

      } catch (error) {
        console.log("Tablo oluşturulurken hata:", error);
      }
    }

    setupDatabase();
  }, []);

  const seansiKaydet = async () => {
    
    const bugun = new Date().toISOString().split('T')[0]; 

    const kategoriLabel = items.find(item => item.value === value)?.label || value;

    try {
      await db.runAsync(
        'INSERT INTO seanslar (kategori, sure, tarih, dikkat_daginikligi) VALUES (?, ?, ?, ?)',
        [value, initialTimes, bugun, distractionCount]
      );

      Alert.alert(
        "Seans Tamamlandı!",
        `Süre: ${initialTimes} dk
        Kategori: ${kategoriLabel}
        Dikkat Dağınıklığı: ${distractionCount}`,
        [
          { text: "Tamam" }
        ]
      );
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  const appState = useRef(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) && 
        nextAppState.match(/inactive|background/)
      ) {
        if (isActive) {
          setIsActive(false); 
          setDistractionCount(prev => prev + 1); // 
          Alert.alert(
        "Dikkat Dağınıklığı!",
        "Uygulamadan çıktığınız için sayaç duraklatıldı.",
        [
          { text: "Tamam" }
        ]
      );
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);


  

  useEffect(() => {
    let interval = null;

    if (isActive && leftTimes > 0) {
      interval = setInterval(() => {
        setLeftTimes((prevTime) => prevTime - 1);
      }, 1000);
    } else if (leftTimes === 0) {
      setIsActive(false);
      seansiKaydet(); 
      setLeftTimes(initialTimes * 60);
      setDistractionCount(0);
    }

    return () => clearInterval(interval);
  }, [isActive, leftTimes]);

  

 
  const handleStart = () => {
    if (!value) { 
      Alert.alert(
        "Kategori Seçilmedi!",
        "Lütfen kategori seçin.",
        [
          { text: "Tamam", onPress: () => console.log("Alert kapandı") }
        ])
      return; 
    }
    setIsActive(true);
  };
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setLeftTimes(initialTimes * 60);
    setDistractionCount(0);
  };

  const changeTime = (amount) => {
    setInitialTimes((prevTime) => {
      const newTime = prevTime + amount;
      if (newTime > 0) {
        setLeftTimes(newTime * 60);
        return newTime;
      }
      return prevTime;
    });
  };

  

  return (
    <View style={styles.container}>
      <Kategori
        items={items} 
        value={value} 
        setValue={setValue} 
      />

      <Sayac
        leftTimes={leftTimes} 
        isActive={isActive} 
        changeTime={changeTime} 
      />

      <Butonlar 
        isActive={isActive} 
        leftTimes={leftTimes} 
        initialTimes={initialTimes} 
        handleStart={handleStart} 
        handlePause={handlePause} 
        handleReset={handleReset} 
      />
    
      

      
    </View>
  )
}

export default AnaSayfa

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop:20,
    alignItems: 'center'
  },
  
  
  
})