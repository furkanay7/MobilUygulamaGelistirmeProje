import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { BarChart } from 'react-native-chart-kit';
import { PieChart } from "react-native-gifted-charts"; 

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

  const pieKategori = () => {
    return (
      <View style={styles.pieKategoriContainer}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.pieKategoriItem}>
            <View>
              <Text style={styles.yuzdeText}>%{item.yuzdeDegeri} </Text>
            </View>
            <Text style={styles.pieKategoriText}>{item.kategoriAdi}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.anaBaslik}>Genel İstatistikler</Text>

        <View style={styles.icContainer}>
          <View>
            <Text style={styles.icBaslik}>Bugün Toplam Odak</Text>
            <Text style={styles.icBaslik}>{stats.bugunToplam} dk</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Genel Toplam Odak</Text>
            <Text style={styles.icBaslik}>{stats.genelToplam} dk</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Bugün Dikkat Dağınıklığı</Text>
            <Text style={styles.icBaslik}>{stats.bugünToplamDikkat}</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Genel Dikkat Dağınıklığı</Text>
            <Text style={styles.icBaslik}>{stats.genelToplamDikkat}</Text>
          </View>
        </View>

        <Text style={styles.anaBaslik}>Grafikler</Text>
        
        <View style={styles.icContainer}>
          
          <Text style={styles.icBaslik}>Son 7 Günlük Süreler</Text>
          
          <BarChart
            data={barData}
            width={330} 
            height={240}
            chartConfig={styles.barChartConfig}
            
            style={{
              paddingRight: 0,
              paddingLeft: 0,
              paddingTop: 10,
              borderRadius: 16
            }}
            
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            withHorizontalLabels={false}
            fromZero={true}
          />
        </View>

        
        <View style={styles.icContainer}>
            <Text style={styles.icBaslik}>Kategori Dağılımı</Text>
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <PieChart
                  data={pieData}    
                  showText={true} 
                  textColor="black"        
                  strokeColor="black"       
                  strokeWidth={1}
                />
              </View>
              {pieKategori()}
          
        </View>
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
  icContainer: { 
    flexDirection: 'column',
    justifyContent: 'space-evenly', 
    marginBottom: 30,
    backgroundColor:'white',
    borderRadius: 16,
    padding: 15,
    width: '90%',
    borderWidth: 1, 
    borderColor: 'black',
    gap: 15,
  },
  icBaslik: { 
    fontSize: 14, 
    color: 'black', 
    textAlign: 'center',
  },
  pieKategoriContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    
  },
  pieKategoriItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding:10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black', 
  },
  pieKategoriText: {
    fontSize: 14,
    color: 'black',
  },
  yuzdeText: {
    color: 'black',
    fontSize: 14,
  },
  barChartConfig: {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    barPercentage: 0.7,
  },
});