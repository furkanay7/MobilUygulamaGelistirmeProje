import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import Istatistikler from './components/Istatistikler';
import CubukGrafik from './components/CubukGrafik';
import PastaGrafik from './components/PastaGrafik';

const db = SQLite.openDatabaseSync('pomodoro.db');

const RaporSayfasi = () => {

  const [stats, setStats] = useState({
    bugunToplam: 0,
    genelToplam: 0,
    bugünToplamDikkat: 0,
    genelToplamDikkat: 0
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [pieData, setPieData] = useState([]);

  const verileriGetirVeIsle = async () => {
      const tumKayitlar = await db.getAllAsync('SELECT * FROM seanslar');
      
      const bugunTarih = new Date().toISOString().split('T')[0];

      let bugunTop = 0;
      let genelTop = 0;
      let bugündikkatsizlikTop = 0;
      let geneldikkatsizlikTop = 0;
      let kategoriDagilimi = {}; 

      tumKayitlar.forEach(kayit => {
        genelTop += kayit.sure;
        geneldikkatsizlikTop += kayit.dikkat_daginikligi;

        if (kayit.tarih === bugunTarih) {
          bugunTop += kayit.sure;
          bugündikkatsizlikTop += kayit.dikkat_daginikligi;
        }

        if (kategoriDagilimi[kayit.kategori]) {
          kategoriDagilimi[kayit.kategori] += kayit.sure;
        } else {
          kategoriDagilimi[kayit.kategori] = kayit.sure;
        }
      });

      setStats({
        bugunToplam: bugunTop,
        genelToplam: genelTop,
        bugünToplamDikkat: bugündikkatsizlikTop,
        genelToplamDikkat: geneldikkatsizlikTop
      });

      const toplamChartSuresi = Object.values(kategoriDagilimi).reduce((a, b) => a + b, 0);

      const PieData = Object.keys(kategoriDagilimi).map((kategori) => {
        const sure = kategoriDagilimi[kategori];
        const yuzde = toplamChartSuresi > 0 ? Math.round((sure / toplamChartSuresi) * 100) : 0;
        const isBigSlice = yuzde > 6;
        const labelText = `%${yuzde}`;

        return {
          value: sure,
          color: 'white',        
          strokeColor: 'black',  
          strokeWidth: 1,
          text: isBigSlice ? labelText : '', 
          textSize: 14,
          textColor: 'black', 
          kategoriAdi: kategori,
          yuzdeDegeri: yuzde
        };
      });
      
      PieData.sort((a, b) => b.value - a.value);
      setPieData(PieData);

      
      const sonHaftaEtiketleri = [];
      const sonHaftaVerileri = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const tarihStr = d.toISOString().split('T')[0];
        const kisaTarih = `${d.getDate()}/${d.getMonth() + 1}`; 

        const secilenGununToplami = tumKayitlar
          .filter(k => k.tarih === tarihStr)
          .reduce((sum, item) => sum + item.sure, 0);

        sonHaftaEtiketleri.push(kisaTarih);
        sonHaftaVerileri.push(secilenGununToplami);
      }

      setBarData({
        labels: sonHaftaEtiketleri,
        datasets: [{ data: sonHaftaVerileri }]
      });

    
  };

  useFocusEffect(
    useCallback(() => {
      verileriGetirVeIsle();
    }, [])
  );

  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.anaBaslik}>Genel İstatistikler</Text>

        <Istatistikler stats={stats} />
        

        <Text style={styles.anaBaslik}>Grafikler</Text>
        
        <CubukGrafik barData={barData} />
        
        <PastaGrafik pieData={pieData} />
        
        
      </View>
    </ScrollView>
  );
}

export default RaporSayfasi

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 20, 
    alignItems:'center'
  },
  anaBaslik: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: 'black',  
  },
  
  
});