// 汎用検証ルール
export const commonRules = {
  email: [
    { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }
  ],
  postalCode: [
    { required: true, message: '郵便番号を入力してください', trigger: 'blur' },
    { pattern: /^\d{3}-\d{4}$/, message: '郵便番号の形式不正です。', trigger: ['blur', 'change'] }
  ],
  phoneNumber: [
    { required: true, message: '電話番号を入力してください', trigger: 'blur' },
    { pattern: /^[0-9]{10,11}$/, message: '電話番号の形式不正です。', trigger: ['blur', 'change'] }
  ],
  mobileNumber: [
    { required: true, message: '携帯電話番号を入力してください', trigger: 'blur' },
    { pattern: /^[0-9]{10,11}$/, message: '電話番号の形式不正です。', trigger: ['blur', 'change'] }
  ]
};

// 这里的规则是针对特定页面的校验规则，可以根据需要进行调整和扩展
//  componets/user/ConsulInfoRCard.vue
//  componets/user/CustomerInfoRCard.vue
//  componets/user/WorkerInfoRCard.vue
export const userCardRules = {
  consulFullName: [{ required: true, message: '氏名を入力してください', trigger: 'blur' }],
  companyName: [{ required: true, message: '会社名を入力してください', trigger: 'blur' }],

  consulEmail: [
    { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change']  }
  ],
  detailEmail: [
    { required: true, message: 'アキコンログインE-mailを入力してください ', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }
  ],
  companyOrStoreName: [{ required: true, message: '企業名/店舗名を入力してください', trigger: 'blur' }],
  companyOrStoreMark: [{ required: true, message: '企業/店舗識別子を入力してください', trigger: 'blur' }],
  companyId: [{ required: true, message: '企業IDを入力してください ', trigger: 'blur' }],

  companyMobile: [{ required: true, message: '携帯電話番号を入力してください ', trigger: 'blur' },
    { pattern: /^[0-9]{10,11}$/, message: '電話番号の形式不正です。', trigger: ['blur', 'change'] },
  ],
  emailPersonal: [
    { required: true, message: 'メールアドレスを入力してください ', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }   
  ],
  emailGmail: [{ required: true, message: 'Gmailを入力してください ', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }   
  ],
  emailCompany: [{ required: true, message: '会社メールアドレスを入力してください ', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }   
  ],
  contactPhone: [{ required: true, message: '連絡先電話番号を入力してください ', trigger: 'blur' }],
  staffEmail: [
    // { required: true, message: '担当者メールアドレスを入力してください ', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式不正です。', trigger: ['blur', 'change'] }   
  ],
  // staffContact: [{ required: true, message: '担当者連絡先を入力してください ', trigger: 'blur' }],

  ...commonRules, // 引入通用规则
   postalCode: [
    // { required: true, message: '郵便番号を入力してください', trigger: 'blur' },
    { pattern: /^\d{7}$/, message: '郵便番号の形式不正です。', trigger: ['blur', 'change'] }
  ],
};

// /pages/sysUserAdd.vue
// /pages/sysUserEdit.vue
export const sysUserRules = {
    fullName: [{ required: true, message: 'ユーザーIDを入力してください ', trigger: 'blur' },],
    userPasswd: [
      { required: true, message: 'パスワードを入力してください ', trigger: 'blur' },
      { min: 6, max: 100, message: 'パスワードは6-100文字で入力してください', trigger: ['blur', 'change'] },
    ],
    userType: [{ required: true, message: 'ユーザー区分（3桁の文字列）を入力してください ', trigger:  ['blur', 'change'] },],
    ...commonRules // 引入通用规则
  };


