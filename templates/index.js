"use strict";

/**
 * Template: Index
 * Type: Static
 */

console.log(
  "%cTemplate Index: LOADED",
  "background-color: white; color: black; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.index = () => {
  const TOP_PATHS = [
    "M1.72229 201.222V2.80377H41.1804V73.7157H59.8949V2.80377H99.353V201.222H59.8949V111.257H41.1804V201.222H1.72229Z",
    "M164.29 203.026C148.431 203.026 136.293 198.253 127.876 188.708C119.533 179.088 115.362 165.221 115.362 147.108V52.8593C115.362 35.8735 119.495 22.9838 127.763 14.1903C136.105 5.39676 148.281 1 164.29 1C180.299 1 192.437 5.39676 200.704 14.1903C209.047 22.9838 213.218 35.8735 213.218 52.8593V147.108C213.218 165.221 209.009 179.088 200.591 188.708C192.249 198.253 180.148 203.026 164.29 203.026ZM164.628 166.499C170.641 166.499 173.647 160.674 173.647 149.024V52.1828C173.647 42.4123 170.716 37.527 164.853 37.527C158.24 37.527 154.933 42.525 154.933 52.5211V149.25C154.933 155.413 155.684 159.847 157.187 162.553C158.69 165.183 161.171 166.499 164.628 166.499Z",
    "M229.227 201.222V2.80377H268.459V82.2837L286.948 2.80377H326.857L304.648 93.6702L331.48 201.222H290.33L268.685 105.169V201.222H229.227Z",
    "M384.241 203.026C367.706 203.026 355.53 198.403 347.714 189.159C339.897 179.839 335.989 166.16 335.989 148.122V2.80377H374.545V146.544C374.545 149.851 374.733 153.045 375.109 156.127C375.485 159.133 376.349 161.613 377.702 163.567C379.055 165.522 381.234 166.499 384.241 166.499C387.322 166.499 389.539 165.559 390.892 163.68C392.245 161.726 393.072 159.208 393.372 156.127C393.748 153.045 393.936 149.851 393.936 146.544V2.80377H432.492V148.122C432.492 166.16 428.584 179.839 420.768 189.159C412.951 198.403 400.776 203.026 384.241 203.026Z",
    "M494.836 203.026C476.723 203.026 463.646 198.516 455.604 189.497C447.637 180.478 443.653 166.123 443.653 146.431V127.041H482.886V151.843C482.886 156.427 483.563 160.035 484.915 162.666C486.343 165.221 488.786 166.499 492.243 166.499C495.851 166.499 498.331 165.446 499.684 163.342C501.112 161.238 501.826 157.78 501.826 152.97C501.826 146.882 501.225 141.809 500.022 137.751C498.82 133.617 496.715 129.709 493.709 126.026C490.778 122.268 486.682 117.909 481.421 112.948L463.608 96.0377C450.305 83.4863 443.653 69.1311 443.653 52.972C443.653 36.0614 447.562 23.1717 455.378 14.303C463.27 5.43434 474.656 1 489.538 1C507.726 1 520.616 5.84771 528.207 15.5431C535.873 25.2386 539.706 39.9696 539.706 59.7363H499.346V46.095C499.346 43.3893 498.557 41.2849 496.978 39.7817C495.475 38.2785 493.408 37.527 490.778 37.527C487.621 37.527 485.291 38.4289 483.788 40.2327C482.36 41.9613 481.646 44.2161 481.646 46.9969C481.646 49.7778 482.398 52.7841 483.901 56.0159C485.404 59.2477 488.373 62.9681 492.807 67.1769L515.693 89.1608C520.277 93.5199 524.486 98.1422 528.319 103.027C532.152 107.838 535.234 113.474 537.564 119.938C539.894 126.327 541.059 134.143 541.059 143.388C541.059 162.027 537.601 176.645 530.687 187.242C523.847 197.765 511.897 203.026 494.836 203.026Z",
    "M608.476 201.222V2.80377H660.899C671.872 2.80377 680.553 5.24642 686.941 10.1317C693.405 15.017 698.027 21.9692 700.808 30.9882C703.589 40.0072 704.979 50.7548 704.979 63.2311C704.979 75.2564 703.814 85.741 701.484 94.6849C699.154 103.554 694.983 110.431 688.97 115.316C683.033 120.201 674.577 122.644 663.604 122.644H647.483V201.222H608.476ZM647.483 87.0187H649.738C657.103 87.0187 661.613 84.9519 663.266 80.8181C664.92 76.6844 665.746 70.5966 665.746 62.5547C665.746 55.0388 664.92 49.2516 663.266 45.1931C661.688 41.0594 657.892 38.9925 651.88 38.9925H647.483V87.0187Z",
    "M764.955 203.026C749.097 203.026 736.959 198.253 728.541 188.708C720.199 179.088 716.027 165.221 716.027 147.108V52.8593C716.027 35.8735 720.161 22.9838 728.428 14.1903C736.771 5.39676 748.947 1 764.955 1C780.964 1 793.102 5.39676 801.37 14.1903C809.712 22.9838 813.883 35.8735 813.883 52.8593V147.108C813.883 165.221 809.675 179.088 801.257 188.708C792.914 198.253 780.814 203.026 764.955 203.026ZM765.294 166.499C771.306 166.499 774.313 160.674 774.313 149.024V52.1828C774.313 42.4123 771.381 37.527 765.519 37.527C758.905 37.527 755.598 42.525 755.598 52.5211V149.25C755.598 155.413 756.35 159.847 757.853 162.553C759.356 165.183 761.836 166.499 765.294 166.499Z",
    "M829.892 201.222V2.80383H869.125V82.2838L887.614 2.80383H927.523L905.314 93.6703L932.145 201.222H890.996L869.35 105.17V201.222H829.892Z",
    "M984.906 203.026C968.371 203.026 956.196 198.403 948.379 189.159C940.563 179.839 936.655 166.161 936.655 148.123V2.80383H975.211V146.544C975.211 149.851 975.399 153.045 975.775 156.127C976.15 159.133 977.015 161.613 978.368 163.568C979.72 165.522 981.9 166.499 984.906 166.499C987.988 166.499 990.205 165.559 991.558 163.68C992.911 161.726 993.737 159.208 994.038 156.127C994.414 153.045 994.602 149.851 994.602 146.544V2.80383H1033.16V148.123C1033.16 166.161 1029.25 179.839 1021.43 189.159C1013.62 198.403 1001.44 203.026 984.906 203.026Z",
    "M1095.5 203.026C1077.39 203.026 1064.31 198.516 1056.27 189.497C1048.3 180.478 1044.32 166.123 1044.32 146.431V127.041H1083.55V151.843C1083.55 156.427 1084.23 160.035 1085.58 162.666C1087.01 165.221 1089.45 166.499 1092.91 166.499C1096.52 166.499 1099 165.446 1100.35 163.342C1101.78 161.238 1102.49 157.78 1102.49 152.97C1102.49 146.882 1101.89 141.809 1100.69 137.751C1099.49 133.617 1097.38 129.709 1094.37 126.026C1091.44 122.268 1087.35 117.909 1082.09 112.948L1064.27 96.0377C1050.97 83.4863 1044.32 69.1311 1044.32 52.972C1044.32 36.0614 1048.23 23.1717 1056.04 14.303C1063.94 5.43434 1075.32 1 1090.2 1C1108.39 1 1121.28 5.84771 1128.87 15.5431C1136.54 25.2386 1140.37 39.9696 1140.37 59.7363H1100.01V46.095C1100.01 43.3893 1099.22 41.2849 1097.64 39.7817C1096.14 38.2785 1094.07 37.527 1091.44 37.527C1088.29 37.527 1085.96 38.4289 1084.45 40.2327C1083.03 41.9613 1082.31 44.2161 1082.31 46.9969C1082.31 49.7778 1083.06 52.7841 1084.57 56.0159C1086.07 59.2477 1089.04 62.9681 1093.47 67.1769L1116.36 89.1608C1120.94 93.5199 1125.15 98.1422 1128.98 103.027C1132.82 107.838 1135.9 113.474 1138.23 119.938C1140.56 126.327 1141.72 134.143 1141.72 143.388C1141.72 162.027 1138.27 176.645 1131.35 187.242C1124.51 197.765 1112.56 203.026 1095.5 203.026Z",
  ];

  const BOTTOM_PATHS = [
    "M28.0364 271.589C24.638 271.589 22.9388 274.652 22.9388 280.778V289.229C22.9388 304.79 23.0953 314.403 23.4083 318.07C23.7661 321.692 24.1014 324.218 24.4144 325.649C24.7722 327.08 25.2417 328.354 25.823 329.472C26.762 331.306 28.64 333.251 31.4571 335.308H2.9512C4.60565 331.999 5.61174 329.182 5.96946 326.856C6.32718 324.531 6.59548 322.072 6.77434 319.479C7.13206 314.202 7.31092 307.115 7.31092 298.216C7.31092 287.44 7.13206 277.603 6.77434 268.705L6.03654 250.26C5.85768 245.609 5.45524 242.367 4.82923 240.534C3.8455 237.628 2.23575 235.012 0 232.687H37.4936C47.5992 232.687 54.9101 233.76 59.4263 235.906C64.2109 238.142 66.6031 241.965 66.6031 247.375C66.6031 253.993 63.7637 259.471 58.0849 263.808C51.3776 268.995 41.3615 271.589 28.0364 271.589ZM44.7374 259.314C46.1683 257.883 47.2191 256.386 47.8899 254.82C48.5606 253.211 48.8959 251.735 48.8959 250.394C48.8959 249.008 48.6947 247.644 48.2923 246.302C47.9346 244.961 47.1968 243.776 46.0789 242.747C43.5749 240.512 39.2822 239.394 33.201 239.394C29.5343 239.394 27.1421 239.841 26.0242 240.735C23.9673 242.434 22.9388 245.766 22.9388 250.729C22.9388 256.318 23.386 259.784 24.2803 261.125C25.1746 262.422 26.203 263.272 27.3656 263.674C28.5282 264.032 30.2945 264.211 32.6644 264.211C35.079 264.211 37.3371 263.741 39.4387 262.802C41.585 261.863 43.3513 260.701 44.7374 259.314Z",
    "M109.9 329.942C118.485 329.942 124.03 319.479 126.534 298.552C127.383 291.487 127.808 283.17 127.808 273.601C127.808 249.902 121.794 238.052 109.766 238.052C97.7373 238.052 91.7232 249.902 91.7232 273.601C91.7232 301.548 95.3227 319.188 102.522 326.521C104.758 328.802 107.217 329.942 109.9 329.942ZM109.766 336.649C97.8715 336.649 88.9061 331.06 82.8696 319.881C77.0566 309.105 74.1501 293.678 74.1501 273.601C74.1501 252.719 80.5668 239.573 93.4 234.162C97.9162 232.284 103.371 231.345 109.766 231.345C128.099 231.345 139.3 239.483 143.369 255.76C144.711 260.991 145.381 267.721 145.381 275.948C145.381 284.176 144.666 292.202 143.235 300.027C141.804 307.808 139.613 314.426 136.662 319.881C130.625 331.06 121.66 336.649 109.766 336.649Z",
    "M188.879 271.589C183.692 271.589 181.099 274.652 181.099 280.778C181.099 306.176 181.524 321.133 182.373 325.649C182.865 328.377 183.491 330.411 184.251 331.753L186.263 335.308H162.453C163.883 331.909 164.711 329.07 164.934 326.789C165.203 324.509 165.426 322.072 165.605 319.479C165.963 314.202 166.142 307.115 166.142 298.216C166.142 287.44 165.963 277.603 165.605 268.705L164.867 250.26C164.688 245.609 164.286 242.367 163.66 240.534C162.676 237.628 161.066 235.012 158.831 232.687H194.312C205.133 232.687 212.958 233.76 217.788 235.906C222.885 238.142 225.434 241.965 225.434 247.375C225.434 252.115 223.668 256.564 220.135 260.723C216.826 264.568 212.489 267.631 207.123 269.912C207.794 287.082 213.182 303.56 223.287 319.344C227.625 326.186 232.052 331.507 236.568 335.308H211.416C207.034 329.316 202.987 317.176 199.275 298.887C198.023 292.538 197.196 287.261 196.794 283.058C196.436 278.855 196.123 276.328 195.855 275.479C195.631 274.585 195.251 273.869 194.715 273.333C193.641 272.17 191.696 271.589 188.879 271.589ZM204.306 259.65C205.558 258.308 206.43 256.877 206.922 255.357C207.458 253.837 207.727 252.384 207.727 250.997C207.727 249.566 207.525 248.158 207.123 246.772C206.765 245.341 206.027 244.089 204.91 243.016C202.45 240.601 198.158 239.394 192.032 239.394C189.751 239.394 187.895 239.483 186.465 239.662C185.078 239.841 183.983 240.333 183.178 241.138C181.792 242.479 181.099 245.9 181.099 251.4C181.099 256.229 181.613 259.314 182.641 260.656C184.475 263.026 187.247 264.211 190.958 264.211C194.67 264.211 197.509 263.786 199.477 262.936C201.489 262.042 203.099 260.946 204.306 259.65Z",
    "M232.78 262.869C231.706 260.276 231.17 257.213 231.17 253.68C231.17 250.148 231.304 247.264 231.572 245.028C231.841 242.747 232.198 240.691 232.645 238.857C233.719 234.743 235.038 232.687 236.603 232.687H295.694C298.287 232.687 300.031 236.532 300.925 244.223C301.149 246.369 301.261 248.583 301.261 250.863C301.261 256.229 300.679 260.231 299.517 262.869C295.671 250.93 290.686 243.284 284.56 239.93C283.173 239.125 281.81 238.723 280.468 238.723C279.127 238.723 278.076 239.081 277.316 239.796C276.556 240.467 275.93 241.562 275.438 243.083C274.633 245.766 274.23 248.985 274.23 252.741V277.893L274.298 298.418V317.869C274.298 322.251 274.856 325.493 275.974 327.594C277.137 329.651 278.3 331.216 279.462 332.289C280.669 333.363 282.078 334.369 283.688 335.308H249.414C252.633 332.669 254.69 330.501 255.584 328.802C257.239 325.716 258.066 322.072 258.066 317.869V257.436C258.066 250.416 257.798 245.9 257.261 243.888C256.724 241.831 256.076 240.467 255.316 239.796C254.556 239.081 253.505 238.723 252.164 238.723C250.822 238.723 249.458 239.125 248.072 239.93C246.686 240.691 245.322 241.719 243.981 243.016C242.684 244.268 241.432 245.743 240.225 247.443C239.062 249.097 237.989 250.818 237.005 252.607C235.082 256.14 233.674 259.56 232.78 262.869Z",
    "M328.46 278.43V292.314C328.46 306.533 328.617 315.298 328.93 318.607C329.287 321.871 329.623 324.218 329.936 325.649C330.249 327.08 330.718 328.354 331.344 329.472C332.328 331.306 334.206 333.251 336.978 335.308H302.972C306.505 333.117 308.808 331.216 309.881 329.606C311.938 326.566 312.966 322.631 312.966 317.802C312.922 305.907 312.899 295.131 312.899 285.473V250.26C312.899 243.597 311.848 238.768 309.747 235.772C308.942 234.699 307.981 233.67 306.863 232.687H357.301C360.342 233.76 362.421 237.516 363.539 243.955C363.852 245.743 364.009 247.487 364.009 249.186C364.009 252.674 363.494 255.447 362.466 257.503L358.844 250.26C356.429 245.52 352.964 242.345 348.448 240.735C345.944 239.841 343.127 239.394 339.997 239.394C336.866 239.394 334.631 239.506 333.289 239.729C331.948 239.908 330.919 240.378 330.204 241.138C329.041 242.434 328.46 244.916 328.46 248.583C328.46 252.205 328.549 254.731 328.728 256.162C328.907 257.548 329.332 258.688 330.003 259.583C331.389 261.327 334.318 262.198 338.789 262.198H359.85C358.822 264.792 357.771 266.625 356.698 267.698C354.551 269.845 351.645 270.918 347.978 270.918C346.547 270.918 345.183 270.761 343.887 270.448C341.472 269.867 339.348 269.576 337.515 269.576C335.681 269.576 334.161 269.755 332.954 270.113C331.791 270.426 330.875 270.94 330.204 271.656C329.041 272.908 328.46 275.166 328.46 278.43Z",
    "M408.244 329.942C416.83 329.942 422.374 319.479 424.878 298.552C425.728 291.487 426.153 283.17 426.153 273.601C426.153 249.902 420.138 238.052 408.11 238.052C396.082 238.052 390.068 249.902 390.068 273.601C390.068 301.548 393.667 319.188 400.866 326.521C403.102 328.802 405.561 329.942 408.244 329.942ZM408.11 336.649C396.216 336.649 387.25 331.06 381.214 319.881C375.401 309.105 372.495 293.678 372.495 273.601C372.495 252.719 378.911 239.573 391.744 234.162C396.261 232.284 401.716 231.345 408.11 231.345C426.443 231.345 437.644 239.483 441.713 255.76C443.055 260.991 443.726 267.721 443.726 275.948C443.726 284.176 443.01 292.202 441.579 300.027C440.148 307.808 437.957 314.426 435.006 319.881C428.97 331.06 420.004 336.649 408.11 336.649Z",
    "M512.041 310.491C513.248 312.235 513.851 314.336 513.851 316.796C513.851 319.255 513.673 321.379 513.315 323.168C513.002 324.956 512.555 326.655 511.973 328.265C510.632 331.798 508.933 334.145 506.876 335.308H452.95C456.482 333.117 458.785 331.216 459.858 329.606C461.915 326.566 462.943 322.631 462.943 317.802C462.899 305.907 462.876 295.153 462.876 285.54V250.394C462.876 243.91 461.803 239.148 459.657 236.107C458.897 234.989 457.958 233.849 456.84 232.687H484.407C481.768 236.487 480.27 240.4 479.913 244.424C479.823 245.766 479.779 247.241 479.779 248.851V310.29C479.779 318.651 480.226 323.659 481.12 325.314C482.014 326.924 483.087 327.885 484.34 328.198C485.592 328.466 487.492 328.6 490.041 328.6C492.589 328.6 495.004 328.153 497.285 327.259C499.565 326.365 501.6 325.113 503.388 323.503C506.429 320.731 509.313 316.393 512.041 310.491Z",
    "M544.74 232.687C543.085 236.845 542.124 241.026 541.856 245.229C541.587 249.388 541.386 252.965 541.252 255.961C541.118 258.957 541.006 262.064 540.917 265.284C540.782 272.796 540.715 279.637 540.715 285.808C540.715 311.117 541.654 326.633 543.532 332.356C543.845 333.34 544.248 334.324 544.74 335.308H521.6C522.986 332.267 523.813 329.517 524.081 327.058C524.35 324.598 524.596 321.67 524.819 318.271C525.356 311.251 525.624 303.157 525.624 293.991C525.624 284.824 525.602 278.564 525.557 275.211C525.512 271.812 525.445 268.503 525.356 265.284C525.043 249.589 524.104 239.617 522.539 235.369L521.6 232.687H544.74Z",
    "M598.366 329.942C606.951 329.942 612.496 319.479 615 298.552C615.849 291.487 616.274 283.17 616.274 273.601C616.274 249.902 610.26 238.052 598.231 238.052C586.203 238.052 580.189 249.902 580.189 273.601C580.189 301.548 583.788 319.188 590.988 326.521C593.223 328.802 595.683 329.942 598.366 329.942ZM598.231 336.649C586.337 336.649 577.372 331.06 571.335 319.881C565.522 309.105 562.616 293.678 562.616 273.601C562.616 252.719 569.033 239.573 581.866 234.162C586.382 232.284 591.837 231.345 598.231 231.345C616.565 231.345 627.766 239.483 631.835 255.76C633.176 260.991 633.847 267.721 633.847 275.948C633.847 284.176 633.132 292.202 631.701 300.027C630.27 307.808 628.079 314.426 625.128 319.881C619.091 331.06 610.126 336.649 598.231 336.649Z",
    "M719.032 232.687C717.378 236.845 716.416 241.026 716.148 245.229C715.88 249.388 715.678 252.965 715.544 255.961C715.41 258.957 715.298 262.064 715.209 265.284C715.075 272.796 715.008 279.637 715.008 285.808C715.008 311.117 715.947 326.633 717.825 332.356C718.138 333.34 718.54 334.324 719.032 335.308H695.892C697.278 332.267 698.105 329.517 698.374 327.058C698.642 324.598 698.888 321.67 699.111 318.271C699.648 311.251 699.916 303.157 699.916 293.991C699.916 284.824 699.894 278.564 699.849 275.211C699.804 271.812 699.737 268.503 699.648 265.284C699.335 249.589 698.396 239.617 696.831 235.369L695.892 232.687H719.032Z",
    "M799.723 278.43V292.314C799.723 306.533 799.88 315.298 800.193 318.607C800.55 321.871 800.886 324.218 801.199 325.649C801.512 327.08 801.981 328.354 802.607 329.472C803.591 331.306 805.469 333.251 808.241 335.308H774.235C777.768 333.117 780.071 331.216 781.144 329.606C783.201 326.566 784.229 322.631 784.229 317.802C784.185 305.907 784.162 295.131 784.162 285.473V250.26C784.162 243.597 783.111 238.768 781.01 235.772C780.205 234.699 779.244 233.67 778.126 232.687H828.564C831.605 233.76 833.684 237.516 834.802 243.955C835.115 245.743 835.272 247.487 835.272 249.186C835.272 252.674 834.757 255.447 833.729 257.503L830.107 250.26C827.692 245.52 824.227 242.345 819.711 240.735C817.207 239.841 814.39 239.394 811.26 239.394C808.13 239.394 805.894 239.506 804.552 239.729C803.211 239.908 802.182 240.378 801.467 241.138C800.304 242.434 799.723 244.916 799.723 248.583C799.723 252.205 799.813 254.731 799.991 256.162C800.17 257.548 800.595 258.688 801.266 259.583C802.652 261.327 805.581 262.198 810.052 262.198H831.113C830.085 264.792 829.034 266.625 827.961 267.698C825.814 269.845 822.908 270.918 819.241 270.918C817.81 270.918 816.447 270.761 815.15 270.448C812.735 269.867 810.611 269.576 808.778 269.576C806.945 269.576 805.424 269.755 804.217 270.113C803.054 270.426 802.138 270.94 801.467 271.656C800.304 272.908 799.723 275.166 799.723 278.43Z",
    "M879.507 329.942C888.093 329.942 893.637 319.479 896.141 298.552C896.991 291.487 897.416 283.17 897.416 273.601C897.416 249.902 891.401 238.052 879.373 238.052C867.345 238.052 861.331 249.902 861.331 273.601C861.331 301.548 864.93 319.188 872.129 326.521C874.365 328.802 876.824 329.942 879.507 329.942ZM879.373 336.649C867.479 336.649 858.513 331.06 852.477 319.881C846.664 309.105 843.758 293.678 843.758 273.601C843.758 252.719 850.174 239.573 863.007 234.162C867.524 232.284 872.979 231.345 879.373 231.345C897.706 231.345 908.907 239.483 912.976 255.76C914.318 260.991 914.989 267.721 914.989 275.948C914.989 284.176 914.273 292.202 912.842 300.027C911.411 307.808 909.22 314.426 906.269 319.881C900.233 331.06 891.267 336.649 879.373 336.649Z",
    "M976.864 247.51C977.759 245.631 978.429 243.776 978.877 241.942C979.369 240.109 979.614 238.343 979.614 236.644C979.614 234.9 979.279 233.558 978.608 232.619H999.334C998.305 234.095 997.433 235.727 996.718 237.516L994.236 243.619C990.167 253.457 984.242 260.857 976.462 265.82C976.954 280.755 980.151 294.84 986.053 308.076C991.375 320.194 997.635 329.271 1004.83 335.308H981.694C975.478 328.69 971.074 316.661 968.48 299.223C967.497 292.828 966.669 285.316 965.999 276.686C965.82 274.406 965.127 272.662 963.919 271.454C962.757 270.202 961.102 269.576 958.956 269.576C956.81 269.576 955.312 269.778 954.462 270.18C953.613 270.582 952.964 271.186 952.517 271.991C951.757 273.377 951.377 276.597 951.377 281.649C951.377 310.759 952.092 327.706 953.523 332.491C953.791 333.385 954.127 334.324 954.529 335.308H932.06C933.491 331.909 934.318 329.07 934.542 326.789C934.81 324.509 935.034 322.072 935.212 319.478C935.57 314.202 935.749 307.115 935.749 298.216C935.749 287.53 935.57 277.737 935.212 268.839L934.475 250.394C934.206 243.642 933.357 238.879 931.926 236.107C931.345 234.989 930.629 233.849 929.779 232.686H956.072C954.283 235.012 953.121 237.18 952.584 239.193C951.779 242.457 951.377 245.721 951.377 248.985C951.377 252.205 951.444 254.53 951.578 255.961C951.712 257.392 952.025 258.576 952.517 259.516C953.546 261.304 955.379 262.221 958.017 262.265C960.655 262.265 962.846 261.863 964.59 261.058C966.379 260.209 968.033 259.091 969.554 257.705C971.074 256.318 972.46 254.753 973.712 253.009C974.964 251.221 976.015 249.388 976.864 247.51Z",
    "M1058.66 300.899L1059 275.143C1059 257.123 1058.33 245.609 1056.98 240.601C1056.36 238.186 1055.6 236.42 1054.7 235.302C1053.85 234.184 1053.16 233.313 1052.62 232.687H1074.62L1073.22 234.565C1071.2 237.516 1070.09 240.847 1069.86 244.558C1069.64 248.27 1069.46 252.026 1069.33 255.827C1069.24 259.627 1069.15 263.406 1069.06 267.162C1068.97 273.467 1068.92 280.509 1068.92 288.29V296.473C1068.92 310.916 1066.6 321.267 1061.95 327.527C1057.34 333.608 1049.83 336.649 1039.41 336.649C1019.24 336.649 1009.21 323.704 1009.3 297.814L1009.36 247.577C1009.36 240.512 1008.11 235.548 1005.61 232.687H1031.03C1028.39 235.861 1027.07 240.378 1027.07 246.235C1027.07 249.634 1027.05 253.121 1027 256.699L1026.73 278.162C1026.69 281.694 1026.67 285.339 1026.67 289.095C1026.67 302.554 1027.07 311.094 1027.87 314.716C1028.68 318.294 1029.66 321.088 1030.83 323.1C1033.51 327.661 1037.49 329.942 1042.76 329.942C1050.9 329.942 1055.91 323.995 1057.79 312.101C1058.37 308.568 1058.66 304.834 1058.66 300.899Z",
    "M1100.28 299.759C1099.7 304.41 1099.41 308.121 1099.41 310.893C1099.41 313.621 1099.74 316.147 1100.41 318.472C1101.09 320.798 1102.05 322.81 1103.3 324.509C1105.98 328.131 1109.38 329.942 1113.49 329.942C1121.36 329.942 1125.3 325.604 1125.3 316.93C1125.3 309.954 1121.25 302.554 1113.16 294.729L1106.18 287.954C1100.06 282.052 1095.88 277.312 1093.64 273.735C1089.21 266.67 1087 259.65 1087 252.674C1087 246.995 1088.83 242.233 1092.5 238.388C1096.93 233.693 1103.3 231.345 1111.62 231.345C1114.88 231.345 1117.34 231.502 1118.99 231.815C1122.08 232.396 1124.14 232.687 1125.16 232.687C1127.76 232.687 1129.77 231.882 1131.2 230.272C1131.74 229.691 1132.32 228.93 1132.95 227.991C1136.21 229.825 1137.84 236.554 1137.84 248.18C1137.84 255.603 1137.1 261.081 1135.63 264.613C1135.14 265.82 1134.58 266.581 1133.95 266.894C1133.24 260.142 1131.04 254.105 1127.38 248.784C1123.09 242.524 1118.12 239.394 1112.49 239.394C1107.66 239.394 1104.69 241.607 1103.57 246.034C1103.25 247.286 1103.1 248.851 1103.1 250.729C1103.1 252.562 1103.66 254.664 1104.77 257.034C1105.89 259.404 1107.35 261.774 1109.13 264.144C1110.97 266.469 1113.07 268.816 1115.44 271.186C1122.59 278.519 1127.33 283.483 1129.66 286.076C1132.03 288.67 1134.13 291.353 1135.96 294.125C1139.99 300.34 1142 306.355 1142 312.168C1142 319.188 1139.27 325.001 1133.82 329.606C1128.18 334.302 1120.94 336.649 1112.09 336.649C1104.75 336.649 1098.45 334.816 1093.17 331.149C1087.36 327.125 1084.45 321.804 1084.45 315.186C1086.2 308.97 1090 304.41 1095.85 301.503C1097.42 300.698 1098.89 300.117 1100.28 299.759Z",
  ];

  let multiplier = 0;

  const buildPaths = (arr) => {
    let markup = "";
    arr.forEach((d) => {
      let delay = 15 * multiplier;
      markup += `<path d="${d}" style="--ani-delay: ${delay}ms;" fill="currentColor" />`;
      multiplier++;
    });

    return markup;
  };

  let section = document.createElement("section");
  section.classList.add("template-index", "container");

  section.innerHTML = `
    <div class="index-inner">
      <svg id="Index-icon" xmlns="http://www.w3.org/2000/svg" width="1142" height="337" viewBox="0 0 1142 337" fill="none">
        <mask
          id="mask0_1408_642"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="226"
          width="1142"
          height="111"
        >
          <rect y="226" width="1142" height="111" fill="#D9D9D9" />
        </mask>
        <mask id="mask1_1408_642" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1142" height="204">
          <rect width="1142" height="204" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask1_1408_642)">${buildPaths(TOP_PATHS)}</g>
        <g mask="url(#mask0_1408_642)">${buildPaths(BOTTOM_PATHS)}</g>
      </svg>
      <div class="index-content">
        <over-flow>
          <p>
            Mit navn Anders Erik Nissen, jeg er en front-end udvikler med 2
            års erfaring inden for e-commerce. Målet med denne portfolio er
            at give indblik i hvem jeg er, samt vise mine programmerings og
            kreative egenskaber.
          </p>
        </over-flow>
      </div>
    </div>
    ${SNIPPETS.link_footer("index-link-footer").outerHTML}
  `;

  return {
    scripts: ["components/overflow"],
    styles: ["index", "component-overflow"],
    html: section,
  };
};
