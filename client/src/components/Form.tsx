import { Picker } from '@react-native-picker/picker';
import { Formik, FormikValues } from 'formik';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { COLORS } from '../styles/colors';
import { IUser } from '../constants/interfaces';
import { STYLES } from '../styles/styles';
import { Dispatch, SetStateAction, useState } from 'react';
import { changeCategory } from '../helpers/api';
import { emptyCategory } from '../constants/emptyMocks';
import { LOCALES } from '../constants/locales';

type FormProps = {
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
};

const initialValues = {
  sum: '0',
  categoryId: '',
};

const ValidationSchema = Yup.object().shape({
  sum: Yup.string()
    .matches(/^\d{1,15}(\.\d+)?$/, 'enter a valid number')
    .required('required'),
});

export default function FormComponent({ setUser, user }: FormProps) {
  const { categories, _id } = user;
  const [error, setError] = useState('');

  const handleFormSubmit = async (values: FormikValues) => {
    const category = categories.find((cat) => cat.id === values.categoryId);
    if (!category) {
      return;
    }
    category.expenses = Number(
      (category.expenses + parseFloat(values.sum)).toFixed(3)
    );

    try {
      const updatedUser = await changeCategory(_id, category);
      setUser(updatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values) => {
          handleFormSubmit(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.inputText}
              value={values.sum}
              onChangeText={handleChange('sum')}
              onBlur={handleBlur('sum')}
            />
            <Picker
              style={styles.inputSelect}
              itemStyle={styles.selectElement}
              selectedValue={values.categoryId}
              onValueChange={handleChange('categoryId')}
            >
              <Picker.Item
                label={emptyCategory.name}
                value={emptyCategory.id}
                key={emptyCategory.id}
              />
              {categories.map((category) => {
                return (
                  <Picker.Item
                    label={category.name}
                    value={category.id}
                    key={category.id}
                  />
                );
              })}
            </Picker>
            <Pressable
              style={styles.button}
              onPress={handleSubmit as (values: FormikValues) => void}
            >
              <Text style={styles.buttonText}>{LOCALES.ADD}</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    ...STYLES.SECTION_CONTAINER,
  },
  form: {
    ...STYLES.SECTION,
    flexDirection: 'row',
    height: 110,
    alignItems: 'center',
    paddingVertical: 16,
  },
  inputText: {
    height: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    borderRadius: 13,
    padding: 10,
    width: '20%',
  },
  inputSelect: {
    height: 50,
    width: '50%',
  },
  selectElement: {
    height: 50,
    fontSize: 15,
  },
  button: {
    ...STYLES.BUTTON_BIG,
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
});
