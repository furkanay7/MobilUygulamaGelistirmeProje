import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-chart-kit';

const CubukGrafik = ({ barData }) => {
  return (
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
    
  )
}

export default CubukGrafik

const styles = StyleSheet.create({
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
    barChartConfig: {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    barPercentage: 0.7,
  },
})