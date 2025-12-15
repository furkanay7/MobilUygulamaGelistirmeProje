import { StyleSheet, Text, View, TouchableOpacity, AppState, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as SQLite from 'expo-sqlite';


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

  const timerRef = useRef(null);

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

        console.log("Tablo oluşturuldu!");
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

 
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

  const startChanging = (amount) => {
    if (isActive) return; 
    changeTime(amount); 
    timerRef.current = setInterval(() => {
      changeTime(amount);
    }, 100);
  };

  const stopChanging = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <View style={styles.container}>

    <View style={styles.kategori}>
      <Text style={styles.kategoriText}>Kategori</Text>
      
        <View style={styles.scroll}>
    <ScrollView 
      showsVerticalScrollIndicator={true} 
      contentContainerStyle={styles.listContainer}
      nestedScrollEnabled={true} 
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.value}
          onPress={() => setValue(item.value)}
          style={[
            styles.listItem,
            value === item.value && styles.seciliListItem
          ]}
        >
          <Text style={[
            styles.listItemText,
            value === item.value && styles.seciliListItemText
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
      </View>
      <View style={styles.zaman}> 
        <TouchableOpacity 
          style={styles.butonZaman} 
          onPressIn={() => startChanging(-1)} 
          onPressOut={stopChanging}
        >
          <Text style={styles.zamanText}>-1</Text>
        </TouchableOpacity>

      <View style={styles.sayac}>
      <Text style={styles.sayacText}>{formatTime(leftTimes)}</Text>
      </View>
        
       <TouchableOpacity 
          style={styles.butonZaman} 
          onPressIn={() => startChanging(+1)} 
          onPressOut={stopChanging}
        >
          <Text style={styles.zamanText}>+1</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buton}>
        <TouchableOpacity style={styles.butonTas} onPress={handleReset}>
          <Text style={styles.butonText}>Sıfırla</Text>
        </TouchableOpacity>
        {!isActive ? (
          <TouchableOpacity style={styles.butonTas} onPress={handleStart}>
            <Text style={styles.butonText}>
              {leftTimes === initialTimes * 60 ? "Başlat" : "Devam"} </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.butonTas} onPress={handlePause}>
            <Text style={styles.butonText}>Duraklat</Text>
          </TouchableOpacity>
        )}

       
        
      </View>
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
  kategori:{
    width:'60%',
    alignItems:'center',
  },
  scroll: {
    width: '100%',      
    height: 130,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden'
  },
  listItem: {
    width: '100%',    
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center', 
  },
  seciliListItem: { 
    borderColor: 'black',
  },
  listItemText: {
    fontSize: 12,
  },
  seciliListItemText: {
    fontWeight: 'bold',
  },
  kategoriText: {
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: 'black', 
  },
  zaman:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    margin:90,
  }, 
  butonZaman:{
    width:60,
    height:60,
    borderWidth:2,
    borderRadius:50,
    justifyContent:'center',
    backgroundColor: 'white',
    alignItems:'center'
  }, 
  zamanText:{
    fontSize:20
  },
  sayac:{
    width:200,
    height:100,
    borderWidth:3,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
  },
  sayacText:{
    fontSize:65
  },
  buton:{
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-evenly',
    alignItems:'center',
  },
  butonTas: {
    width:80,
    height:80,
    borderWidth:2,
    borderRadius:20,
    justifyContent:'center',
    backgroundColor: 'white',
    alignItems:'center'
  },
  butonText:{
  }
})