import { StyleSheet, Text, View, TouchableOpacity, AppState, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

const AnaSayfa = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // Seçilen değer
  const [items, setItems] = useState([
    {label: 'Ders Çalışma', value: 'ders'},
    {label: 'Kodlama', value: 'kodlama'},
    {label: 'Proje Geliştirme', value: 'proje'},
    {label: 'Kitap Okuma', value: 'kitap'},
    {label: 'Diğer', value: 'diger'}
  ]);
  const [initialTimes, setInitialTimes] = useState(25);
  const [leftTimes, setLeftTimes] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  const appState = useRef(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) && 
        nextAppState.match(/inactive|background/)
      ) {
        // Uygulama arka plana atıldı!
        if (isActive) {
          setIsActive(false); // Sayacı durdur
          setDistractionCount(prev => prev + 1); // Hatayı 1 artır
          alert("Dikkat Dağınıklığı! Uygulamadan çıktığınız için sayaç duraklatıldı.");
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);


  

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
  const handleStart = () => {
    if (selectedCategory === 'Seçiniz') {
      alert("Lütfen bu seans için bir kategori seçiniz!");
      return;
    }
    setIsActive(true);
  };
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

    <View style={styles.kategori}>
      <Text style={styles.kategoriText}>Kategori</Text>
      
        <View style={styles.scroll}>
    <ScrollView 
      // horizontal komutunu SİLDİK
      showsVerticalScrollIndicator={true} // Dikey çubuk görünsün
      contentContainerStyle={styles.listContainer}
      nestedScrollEnabled={true} // İç içe kaydırma sorunu olmasın
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
        <TouchableOpacity style={styles.butonZaman} onPress={() => changeTime(-1)}>
          <Text style={styles.zamanText}>-1</Text>
        </TouchableOpacity>

      <View style={styles.sayac}>
         {/* Sayaç Göstergesi */}
      <Text style={styles.sayacText}>{formatTime(leftTimes)}</Text>

          {distractionCount > 0 && (
            <Text>Dikkat Dağınıklığı: {distractionCount} </Text>
          )}
      </View>
     

      {/* Süre Ayarlama (+/-) */}
      
        
        <TouchableOpacity style={styles.butonZaman} onPress={() => changeTime(+1)}>
          <Text style={styles.zamanText}>+1</Text>
        </TouchableOpacity>
      </View>

      {/* Kontrol Butonları */}
      <View style={styles.buton}>
        <TouchableOpacity style={styles.butonTas} onPress={handleReset}>
          <Text style={styles.butonText}>Sıfırla</Text>
        </TouchableOpacity>
        {!isActive ? (
          <TouchableOpacity style={styles.butonTas} onPress={handleStart}>
            <Text style={styles.butonText}>Başlat</Text>
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
    paddingTop:30,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden'
  },
  listContainer: {
    gap: 0, // Elemanlar arası boşluk
  },
  listItem: {
    width: '100%',    
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
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
    fontSize:30,
    marginBottom: 10,
  },
  zaman:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    margin:90
  }, 
  butonZaman:{
    width:70,
    height:70,
    borderWidth:2,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  }, 
  zamanText:{
    fontSize:20
  },
  sayac:{
    width:150,
    height:100,
    borderWidth:2,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
  },
  sayacText:{
    fontSize:45
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
    alignItems:'center'
  },
  butonText:{
  }
})