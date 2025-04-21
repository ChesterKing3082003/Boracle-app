import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Platform, PermissionsAndroid, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { healthDataMap } from '../data/health-data';
import { BleManager, Characteristic, Device, Service } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import CharacteristicSelectModal from '../../components/CharacteristicSelectModal';


const manager = new BleManager();

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const item = healthDataMap[id as string];

    const [devices, setDevices] = useState<Device[]>([]);
    const [scanning, setScanning] = useState(false);

    const [device, setDevice] = useState<Device | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [characteristics, setCharacteristics] = useState<Record<string, Characteristic[]>>({});
    const [characteristic, setCharacteristic] = useState<Characteristic | null>(null);
    const [value, setValue] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        return () => {
            manager.stopDeviceScan(); // Stop scanning when leaving screen
        };
    }, []);

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            const allGranted = Object.values(granted).every(
                (status) => status === PermissionsAndroid.RESULTS.GRANTED
            );

            return allGranted;
        }
        // On iOS, permissions are handled via Info.plist
        return true;
    };

    const startScan = async () => {
        const permissionGranted = await requestBluetoothPermissions();
        if (!permissionGranted) {
            console.warn('Bluetooth permission not granted');
            return;
        }

        // Clear device list on new scan to ensure we're not keeping old devices
        setDevices([]);
        setScanning(true);

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error('Scan error:', error);
                setScanning(false);
                return;
            }

            // Skip unnamed devices and prevent adding duplicate devices
            if (device && (device.name || device.localName)) {
                setDevices((prevDevices) => {
                    // If device is not already in the list based on its id, add it
                    if (!prevDevices.some((d) => d.id === device.id)) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;  // Return the previous list if the device is already in the list
                });
            }
        });

        // Stop scan after 10 seconds
        setTimeout(() => {
            manager.stopDeviceScan();
            setScanning(false);
        }, 10000);
    };

    const connectToDevice = async (device: Device | null) => {
        if (device == null) {
            Alert.alert('Error', 'Device not found.');
            return;
        }
        try {
            setIsConnecting(true);
            await device.connect();
            setDevice(device); // Save connected device
            // Discover services and characteristics
            await device.discoverAllServicesAndCharacteristics();
            setIsConnected(true);

            const services = await device.services();
            setServices(services);

            const allCharacteristics: Record<string, Characteristic[]> = {};

            for (const service of services) {
                const chars = await device.characteristicsForService(service.uuid);
                // test sample uuid characteristic
                const char_str = '6e400003-b5a3-f393-e0a9-e50e24dcca9f'
                for (const char of chars) {
                    if (char_str == char.uuid) setCharacteristic(char)
                }
                allCharacteristics[service.uuid] = chars;
            }

            setCharacteristics(allCharacteristics);
            console.log(characteristic)
            characteristic?.monitor((error, char) => {
                if (error) {
                  console.error('Monitor error:', error);
                  return;
                }
                const value = char?.value;
                if (value) {
                const buffer = Buffer.from(value, 'base64');
                setValue(buffer[0].toString())
                console.log('Received data:', buffer);
                }

              });

            setShowModal(true);
        } catch (error) {
            console.error('Connection error:', error);
            Alert.alert('Error', 'Failed to connect to device.');
        }
        finally {
            setIsConnecting(false);
          }
    };

    const disconnectFromDevice = async () => {
        if (!device) return;
        try {
          await device.cancelConnection();
          setIsConnected(false);
        } catch (error) {
          console.error('Disconnection error:', error);
          Alert.alert('Error', 'Failed to disconnect to device.');
        }
      };

    // const handleSelectCharacteristic = (service: Service, char: Characteristic) => {
    //     setShowModal(false);
    //     setSelectedCharacteristic(char);
    //     char.monitor((error, char) => {
    //         if (error) {
    //           console.error('Monitor error:', error);
    //           return;
    //         }
    //         const value = char?.value;
    //         if (value) {
    //           const buffer = Buffer.from(value, 'base64');
    //           console.log('Received data:', buffer);
    //           // Do something with the buffer (convert to int, float, etc.)
    //         }
    //       });
       
        
    //     Alert.alert('Ready', `Selected characteristic:\n${char.uuid}`);
    //     // Connect and start working with the selected characteristic here!
    //   };

    const openModal = (device: Device) => {
        setDevice(device);
        setShowModal(true);
      };

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Data not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.subtitle}>What it means</Text>
            <Text style={styles.text}>{item.description}</Text>
            <Text style={styles.subtitle}>Health Tips</Text>
            <Text style={styles.text}>{item.tips}</Text>

            <View style={styles.scanSection}>
                <Text style={styles.subtitle}>Scan Nearby Devices</Text>
                <Button
                    title={scanning ? 'Scanning...' : 'Scan Devices'}
                    onPress={startScan}
                    disabled={scanning}
                />

                <FlatList
                    data={devices}
                    keyExtractor={(item) => `${item.id}-${item.name || item.localName || 'unnamed'}`}  // Combination of ID, name, and localName
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)}>
                            <View style={styles.deviceItem}></View>
                            <Text style={styles.deviceItem}>
                                {item.name || item.localName || 'Unnamed'} - {item.id}
                            </Text>
                        </TouchableOpacity>

                    )}
                    ListEmptyComponent={() =>
                        !scanning ? (
                            <Text style={styles.text}>
                                No devices found. Try scanning again or move closer to a device.
                            </Text>
                        ) : null
                    }
                />

                    <Button
                    title={'Send data'}
                    // onPress={}
                    // disabled={}
                />

            </View>
            <CharacteristicSelectModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={() => connectToDevice(device)}
        device={device}
        onDisconnect={disconnectFromDevice}
      />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#222',
        marginBottom: 8,
    },
    value: {
        fontSize: 20,
        color: '#4CAF50',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 6,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    scanSection: {
        marginTop: 24,
    },
    deviceItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    characteristicItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    serviceTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    serviceBlock: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
    },
});
