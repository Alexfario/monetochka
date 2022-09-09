import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StackParamList } from '../../App';
import { emptyCategory } from '../constants/emptyMocks';
import { ICategory, IUser } from '../constants/interfaces';
import { LOCALES } from '../constants/locales';
import { deleteCategory } from '../helpers/api';
import { getColorStyle } from '../helpers/getColorStyle';
import { STYLES } from '../styles/styles';
import ModalEditCategory from './ModalEditCategory';
import ModalNewCategory from './ModalNewCategory';
import Navbar from './Navbar';

type CategoriesScreenProps = {
  params: NativeStackScreenProps<StackParamList, 'Categories'>;
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
};

export default function CategoriesScreen({
  user,
  setUser,
}: CategoriesScreenProps) {
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(emptyCategory);
  const { _id } = user;
  const [error, setError] = useState('');

  const handleDeleteCategory = async (category: ICategory) => {
    try {
      const user = await deleteCategory(_id, category.id);
      setUser(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Navbar title={'Categories'} message={LOCALES.CATEGORIES} />
        <View style={styles.categoriesContainer}>
          <ModalNewCategory
            modalAddVisible={modalAddVisible}
            setModalAddVisible={setModalAddVisible}
            userId={user._id}
            setUser={setUser}
          />
          <ModalEditCategory
            modalEditVisible={modalEditVisible}
            setModalEditVisible={setModalEditVisible}
            category={selectedCategory}
            userId={user._id}
            setUser={setUser}
          />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <View style={styles.categories}>
            {user.categories.map((category) => (
              <View style={styles.rowContainer} key={category.id}>
                <View style={styles.categoryContainer}>
                  {category.icon ? (
                    <View style={styles.iconEmoji}>
                      <Text>{category.icon}</Text>
                    </View>
                  ) : (
                    <View style={styles.icon}></View>
                  )}
                  <Text
                    style={[styles.category, getColorStyle(category.color)]}
                  >
                    {category.name}
                  </Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <Pressable
                    style={styles.firstBtn}
                    onPress={() => {
                      setSelectedCategory(category);
                      setModalEditVisible(true);
                    }}
                  >
                    <Text style={styles.buttonEdit}>{LOCALES.EDIT}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSelectedCategory(category);
                      handleDeleteCategory(category);
                    }}
                  >
                    <Text style={styles.buttonEdit}>{LOCALES.DELETE}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => setModalAddVisible(true)}
        >
          <Text style={styles.buttonText}>{LOCALES.ADD_NEW_CATEGORY}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...STYLES.PAGE_CONTAINER,
  },
  categoriesContainer: {
    ...STYLES.SECTION_CONTAINER,
  },
  categories: {
    ...STYLES.SECTION,
    paddingTop: 16,
  },
  rowContainer: {
    ...STYLES.SECTION_ELEMENT_ROW_CONTINER,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    ...STYLES.SECTION_ELEMENT_ROW_CONTINER,
  },
  category: {
    ...STYLES.SECTION_ELEMENT,
  },
  'category:last-child': {
    marginBottom: 0,
  },
  icon: {
    ...STYLES.ICON,
  },
  iconEmoji: {
    ...STYLES.ICON_EMOJI,
  },
  buttonEdit: {
    ...STYLES.BUTTON_SMALL,
    lineHeight: 20,
  },
  button: {
    ...STYLES.BUTTON_BIG,
    marginHorizontal: 16,
  },
  buttonText: {
    ...STYLES.BUTTON_BIG_TEXT,
  },
  errorContainer: {
    ...STYLES.ERROR_CONTAINER,
  },
  errorText: {
    ...STYLES.ERROR_TEXT,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstBtn: {
    marginRight: 16,
  },
});
