import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import { EmojiType } from 'rn-emoji-keyboard/lib/typescript/types';
import { ICategory, IUser } from '../constants/interfaces';
import { STYLES } from '../styles/styles';
import ModalColorPicker from './ModalColorPicker';
import { changeCategory } from '../helpers/api';

type ModalEditCategoryProps = {
  modalEditVisible: boolean;
  setModalEditVisible: Dispatch<SetStateAction<boolean>>;
  category: ICategory;
  userId: string;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
};

export default function ModalEditCategory({
  modalEditVisible,
  setModalEditVisible,
  category,
  userId,
  setUser,
}: ModalEditCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chosenIcon, setChosenIcon] = useState(category.icon);
  const [chosenColor, setChosenColor] = useState(category.color);
  const [modalColorVisible, setModalColorVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setChosenIcon(category.icon);
    setChosenColor(category.color);
  }, [category]);

  const handleEmojiPick = (emojiObject: EmojiType) => {
    setChosenIcon(emojiObject.emoji);
  };

  const handleFormSubmit = async () => {
    try {
      const body = {
        ...category,
        icon: chosenIcon,
        color: chosenColor,
      };
      const user = await changeCategory(userId, body);
      console.log(user);
      setUser(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const getColorStyle = (color: string) => {
    return {
      color: color,
    };
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalEditVisible}
      onRequestClose={() => {
        setModalEditVisible(!modalEditVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.form}>
              <Text style={styles.icon}>{chosenIcon}</Text>
              <Text style={[styles.categoryName, getColorStyle(chosenColor)]}>
                {category.name}
              </Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <Pressable onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.buttonSmall}>Add icon</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalColorVisible(true);
                  setModalColorVisible(true);
                }}
              >
                <Text style={styles.buttonSmall}>Set color</Text>
              </Pressable>
              <EmojiPicker
                onEmojiSelected={handleEmojiPick}
                open={isOpen}
                onClose={() => setIsOpen(!isOpen)}
              />
              <ModalColorPicker
                modalColorVisible={modalColorVisible}
                setModalColorVisible={setModalColorVisible}
                setChosenColor={setChosenColor}
              />
              <Pressable
                style={styles.buttonBig}
                onPress={() => {
                  handleFormSubmit();
                  setModalEditVisible(!modalEditVisible);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.buttonLast}
              onPress={() => setModalEditVisible(!modalEditVisible)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonBig: {
    ...STYLES.BUTTON_BIG,
    marginBottom: 16,
    width: '60%',
  },
  buttonText: {
    ...STYLES.BUTTON_BIG_TEXT,
  },
  centeredView: {
    ...STYLES.MODAL_CENTERED,
  },
  modalContainer: {
    ...STYLES.MODAL_CONTAINER,
  },
  modalView: {
    ...STYLES.MODAL_VIEW,
  },
  buttonLast: {
    ...STYLES.BUTTON_BIG,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  categoryName: {
    height: 20,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 18,
  },
  icon: {
    height: 20,
    marginBottom: 10,
  },
  buttonSmall: {
    ...STYLES.BUTTON_SMALL,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  errorContainer: {
    ...STYLES.ERROR_CONTAINER,
  },
  errorText: {
    ...STYLES.ERROR_TEXT,
  },
});
