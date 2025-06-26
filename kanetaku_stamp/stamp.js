document.addEventListener('DOMContentLoaded', () => {
    // --- 既存の要素 ---
    const getStampArea = document.getElementById('getStampArea'); // 旧メイン画面
    const getStampButton = document.getElementById('getStampButton'); // カメラ起動ボタン

    const qrScanArea = document.getElementById('qrScanArea');
    const cancelScanButton = document.getElementById('cancelScanButton');
    const qrCodeContainerId = "reader";

    const stampResultArea = document.getElementById('stampResultArea');
    const acquiredStampImage = document.getElementById('acquiredStampImage');
    const acquisitionMessage = document.getElementById('acquisitionMessage');
    const stampLocationName = document.getElementById('stampLocationName');
    const stampDescription = document.getElementById('stampDescription');
    const viewStampsButtonFromAcquired = document.getElementById('viewStampsButtonFromAcquired');
    const backToCameraFromAcquired = document.getElementById('backToCameraFromAcquired'); // 新しいボタン

    const stampBookArea = document.getElementById('stampBookArea');
    const backToMainButton = document.getElementById('backToMainButton'); // フッターナビがあるため基本的には非表示
    const stampsCollectedCount = document.getElementById('stampsCollectedCount');
    const stampsTotalCount = document.getElementById('stampsTotalCount');
    const stampGrid = document.getElementById('stampGrid');

    const stampDetailModal = document.getElementById('stampDetailModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const modalStampImage = document.getElementById('modalStampImage');
    const modalStampName = document.getElementById('modalStampName');
    const modalStampDescription = document.getElementById('modalStampDescription');
    const modalStampAcquiredDate = document.getElementById('modalStampAcquiredDate');

    // --- 新しく追加する要素 ---
    const mapArea = document.getElementById('mapArea');
    const cameraArea = document.getElementById('cameraArea'); // 旧 getStampArea を cameraArea に変更
    const couponArea = document.getElementById('couponArea');

    const footerNav = document.querySelector('.footer-nav');
    const navItems = document.querySelectorAll('.nav-item'); // 各ナビゲーション項目


    // モックデータ (実際はAPIなどから取得)
    const allStamps = [
        { id: 'hachioji-castle', name: '八王子城跡', description: '戦国時代の山城の跡地。関東有数の規模を誇ります。', imageUrl: 'https://via.placeholder.com/150x150/FFD700/FFFFFF?text=HachiojiCastle', isAcquired: false, acquiredDate: null },
        { id: 'mount-takao', name: '高尾山', description: '都心から手軽に行ける自然豊かな山。ミシュラン三つ星評価。', imageUrl: 'https://via.placeholder.com/150x150/8BC34A/FFFFFF?text=MtTakao', isAcquired: false, acquiredDate: null },
        { id: 'musashi-ichinomiya', name: '武蔵一宮 氷川神社', description: '2000年以上の歴史を持つとされる由緒ある神社です。', imageUrl: 'https://via.placeholder.com/150x150/FF6347/FFFFFF?text=HikawaJinja', isAcquired: false, acquiredDate: null },
        { id: 'kawagoe-warehouse', name: '川越一番街', description: '蔵造りの町並みが美しい「小江戸」として知られています。', imageUrl: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=Kawagoe', isAcquired: false, acquiredDate: null },
        { id: 'lake-okutama', name: '奥多摩湖', description: '多摩川をせき止めて作られた人造湖。美しい景観が広がります。', imageUrl: 'https://via.placeholder.com/150x150/6A5ACD/FFFFFF?text=OkutamaLake', isAcquired: false, acquiredDate: null },
        { id: 'tachikawa-park', name: '国営昭和記念公園', description: '広大な敷地を持つ都内有数の公園。四季折々の花が楽しめます。', imageUrl: 'https://via.placeholder.com/150x150/FFB6C1/FFFFFF?text=ShowaPark', isAcquired: false, acquiredDate: null },
        { id: 'chofu-jindaiji', name: '深大寺', description: '東京都内で2番目に古いお寺。そばが名物です。', imageUrl: 'https://via.placeholder.com/150x150/FFDAB9/FFFFFF?text=Jindaiji', isAcquired: false, acquiredDate: null },
        { id: 'fuchu-okunitama', name: '大國魂神社', description: '武蔵国の総社。歴史あるお祭りでも有名です。', imageUrl: 'https://via.placeholder.com/150x150/DA70D6/FFFFFF?text=OkunitamaJinja', isAcquired: false, acquiredDate: null },
    ];
    stampsTotalCount.textContent = allStamps.length;

    // 音声フィードバック
    const acquisitionSound = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

    // html5-qrcode のインスタンス
    let html5QrCode;

    // --- 初期表示設定 ---
    // 全てのコンテンツエリアを配列にまとめる
    const allContentAreas = [mapArea, cameraArea, qrScanArea, stampResultArea, stampBookArea, couponArea];

    function hideAllContentAreas() {
        allContentAreas.forEach(area => area.classList.add('hidden'));
    }

    // 最初にマップ画面を表示し、ナビゲーションのアクティブ状態を設定
    hideAllContentAreas();
    mapArea.classList.remove('hidden');
    navItems[0].classList.add('active'); // マップをアクティブに

    // --- 関数定義 ---

    // 画面表示を切り替えるヘルパー関数 (フッターナビ対応版)
    function showScreen(screenElement, activateNavItem = null) {
        hideAllContentAreas(); // 全てのコンテンツエリアを非表示にする
        screenElement.classList.remove('hidden'); // 指定されたコンテンツエリアを表示

        // ナビゲーションアイテムのアクティブ状態を更新
        navItems.forEach(item => item.classList.remove('active'));
        if (activateNavItem) {
            activateNavItem.classList.add('active');
        } else {
            // 現在のコンテンツエリアに対応するナビアイテムをアクティブにする
            // （例えば、QRスキャン中やスタンプ獲得結果画面は、カメラアイコンをアクティブに保つ）
            let targetNavId = null;
            if (screenElement === mapArea) targetNavId = 'mapArea';
            else if (screenElement === cameraArea || screenElement === qrScanArea || screenElement === stampResultArea) targetNavId = 'cameraArea';
            else if (screenElement === stampBookArea) targetNavId = 'stampBookArea';
            else if (screenElement === couponArea) targetNavId = 'couponArea';

            if (targetNavId) {
                const activeNav = document.querySelector(`.nav-item[data-target="${targetNavId}"]`);
                if (activeNav) activeNav.classList.add('active');
            }
        }
        // モーダルは常に非表示（必要に応じて表示）
        stampDetailModal.classList.add('hidden');
    }


    // スタンプ帳をレンダリングする関数
    function renderStampBook() {
        stampGrid.innerHTML = '';
        let collectedCount = 0;

        allStamps.forEach(stamp => {
            const stampItem = document.createElement('div');
            stampItem.classList.add('stamp-item');
            if (!stamp.isAcquired) {
                stampItem.classList.add('unacquired');
            } else {
                collectedCount++;
                stampItem.addEventListener('click', () => showStampDetail(stamp));
            }

            const img = document.createElement('img');
            img.src = stamp.imageUrl;
            img.alt = stamp.name;
            img.classList.add('stamp-image');

            const p = document.createElement('p');
            p.textContent = stamp.isAcquired ? stamp.name : "？";

            stampItem.appendChild(img);
            stampItem.appendChild(p);
            stampGrid.appendChild(stampItem);
        });

        stampsCollectedCount.textContent = collectedCount;
    }

    // スタンプ詳細モーダルを表示する関数
    function showStampDetail(stamp) {
        modalStampImage.src = stamp.imageUrl;
        modalStampName.textContent = stamp.name;
        modalStampDescription.textContent = stamp.description;
        modalStampAcquiredDate.textContent = stamp.acquiredDate ? `獲得日時: ${stamp.acquiredDate}` : '未獲得';
        
        stampDetailModal.classList.add('visible');
    }

    // QRコードリーダーの停止処理
    async function stopQrCodeScanner() {
        if (html5QrCode && html5QrCode.isScanning) {
            try {
                await html5QrCode.stop();
                console.log("QRコードスキャンを停止しました。");
            } catch (err) {
                console.error("QRコードスキャン停止エラー:", err);
            }
        }
    }


    // --- イベントリスナー ---

    // フッターナビゲーションのクリックイベント
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // デフォルトのリンク動作を防止

            const targetId = item.dataset.target; // data-target属性からIDを取得
            const targetElement = document.getElementById(targetId);

            stopQrCodeScanner(); // 他の画面に遷移する際はQRスキャナーを停止

            showScreen(targetElement, item); // 画面を切り替える

            // スタンプ帳画面に切り替える際に、スタンプ帳を再レンダリング
            if (targetElement === stampBookArea) {
                renderStampBook();
            }
        });
    });


    // 「QRコードをスキャンする」ボタンクリック (旧 getStampButton)
    getStampButton.addEventListener('click', async () => {
        showScreen(qrScanArea); // QRスキャン画面を表示
        console.log('QRコードスキャン開始...');

        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode(qrCodeContainerId);
        }

        try {
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText, decodedResult) => {
                    handleQrCodeScanSuccess(decodedText);
                    stopQrCodeScanner(); // 読み取り成功したら停止
                },
                (errorMessage) => {
                    // QRコードが検出されないなどの通常のエラーはコンソールに出さない
                }
            );
            console.log("カメラ起動成功。QRコードスキャンを開始しました。");
        } catch (err) {
            console.error("カメラ起動エラーまたはQRコードスキャンエラー:", err);
            alert("カメラへのアクセスに失敗しました。カメラの許可設定を確認してください。");
            showScreen(cameraArea); // エラーが発生したらカメラ起動ボタンのある画面に戻る
        }
    });

    // QRスキャンキャンセルボタンクリック
    cancelScanButton.addEventListener('click', async () => {
        stopQrCodeScanner();
        showScreen(cameraArea); // カメラ起動ボタンのある画面に戻る
    });

    // QRコード読み取り成功時の処理
    function handleQrCodeScanSuccess(qrData) {
        showScreen(stampResultArea); // スタンプ獲得結果画面を表示

        const foundStamp = allStamps.find(stamp => qrData.includes(stamp.id));

        // アニメーションのリセット（再利用のため）
        const stampAnimationContainer = stampResultArea.querySelector('.stamp-animation');
        stampAnimationContainer.classList.remove('active');
        acquisitionMessage.textContent = "🎉 スタンプを獲得しました！"; // メッセージを元に戻す
        acquisitionMessage.style.color = "#28a745"; // 色も元に戻す


        if (foundStamp && !foundStamp.isAcquired) {
            foundStamp.isAcquired = true;
            foundStamp.acquiredDate = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            
            acquiredStampImage.src = foundStamp.imageUrl;
            stampLocationName.textContent = foundStamp.name;
            stampDescription.textContent = foundStamp.description;

            stampAnimationContainer.classList.add('active');
            if (acquisitionSound) {
                acquisitionSound.play().catch(e => console.error("音声再生エラー:", e));
            }
            console.log(`スタンプ「${foundStamp.name}」を獲得しました！`);
        } else if (foundStamp && foundStamp.isAcquired) {
            acquiredStampImage.src = foundStamp.imageUrl;
            acquisitionMessage.textContent = "🎉 既にこのスタンプは獲得済みです！";
            acquisitionMessage.style.color = "#FFD700";
            stampLocationName.textContent = foundStamp.name;
            stampDescription.textContent = "このスタンプは、以前に獲得されています。";
            
            stampAnimationContainer.classList.add('active');
            console.log(`スタンプ「${foundStamp.name}」は既に獲得済みです。`);
        }
        else {
            acquiredStampImage.src = "https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=Unknown";
            acquisitionMessage.textContent = "🤔 不明なQRコードです";
            acquisitionMessage.style.color = "#FF4500";
            stampLocationName.textContent = "不明な場所";
            stampDescription.textContent = "このQRコードはスタンプラリーのものではありません。";
            
            stampAnimationContainer.classList.add('active');
            console.warn("未知のQRコードがスキャンされました:", qrData);
        }
    }

    // 「スタンプ帳を見る」（獲得後画面から）ボタンクリック
    viewStampsButtonFromAcquired.addEventListener('click', () => {
        showScreen(stampBookArea); // スタンプ帳画面を表示
        renderStampBook(); // スタンプ帳を更新して表示
        // アニメーションのリセットは showScreen で行われるので不要
    });

    // 「スキャン画面に戻る」（獲得後画面から）ボタンクリック
    backToCameraFromAcquired.addEventListener('click', () => {
        showScreen(cameraArea); // カメラ起動ボタンのある画面に戻る
    });

    // 「戻る」（スタンプ帳からメイン）ボタンクリック (フッターナビがあるためhiddenに)
    backToMainButton.addEventListener('click', () => {
        showScreen(cameraArea); // カメラ起動ボタンのある画面に戻る
    });

    // モーダルの閉じるボタン
    closeModalButton.addEventListener('click', () => {
        stampDetailModal.classList.remove('visible');
    });

    // モーダル外クリックで閉じる
    window.addEventListener('click', (event) => {
        if (event.target == stampDetailModal) {
            stampDetailModal.classList.remove('visible');
        }
    });
});