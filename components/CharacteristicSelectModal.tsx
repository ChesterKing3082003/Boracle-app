import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Device } from 'react-native-ble-plx';

type Props = {
  visible: boolean;
  onClose: () => void;
  device: Device | null;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
};

export default function CharacteristicSelectModal({
  visible,
  onClose,
  device,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {device ? `Device: ${device.name || 'Unnamed Device'}` : 'No Device'}
          </Text>

          {device && (
            <TouchableOpacity
              onPress={isConnected ? onDisconnect : onConnect}
              style={[styles.button, { backgroundColor: isConnected ? 'tomato' : 'green' }]}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>
                  {isConnected ? 'Disconnect' : 'Connect Device'}
                </Text>
              )}


            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeText: {
    textAlign: 'center',
    color: 'blue',
  },
});