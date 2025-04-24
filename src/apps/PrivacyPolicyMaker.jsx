import React, {useEffect, useState} from "react"
import {Formik, Form, ErrorMessage, Field} from "formik"
import * as Yup from "yup"

const purpose_make = domain => (
    `<h2>個人情報の利用目的</h2><p>当サイト（${domain}）では、メールでのお問い合わせ、メールマガジンへの登録などの際に、お名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。</p><p>これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。</p>`
    )
const disclosure = "<h2>個人情報の第三者への開示</h2><p>当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p><ul><li>本人のご了解がある場合</li><li>法令等への協力のため、開示が必要となる場合</li></ul><p>個人情報の開示、訂正、追加、削除、利用停止</p><p>ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させていただいた上、速やかに対応させていただきます。</p>"
const googleAnalytics = "<h2>アクセス解析ツールについて</h2><p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。</p><p>このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。</p><p>このトラフィックデータは匿名で収集されており、個人を特定するものではありません。</p><p>この機能は、Cookieを無効にすることで収集を拒否することが出来ます。</p><p>お使いのブラウザの設定をご確認ください。この規約に関しての詳細は<a href='https://marketingplatform.google.com/about/analytics/terms/jp/' target='_blank' >Googleアナリティクスサービス利用規約のページ</a>や<a href='https://policies.google.com/technologies/ads?hl=ja' target='_blank'>Googleポリシーと規約のページ</a>をご覧ください。</p>"

const comment = "<h2>当サイトへのコメントについて</h2><p>当サイトでは、スパム・荒らしへの対応として、コメントの際に使用されたIPアドレスを記録しています。</p><p>これはブログの標準機能としてサポートされている機能で、スパム・荒らしへの対応以外にこのIPアドレスを使用することはありません。</p><p>また、メールアドレスとURLの入力に関しては、任意となっております。</p><p>全てのコメントは管理人が事前にその内容を確認し、承認した上での掲載となりますことをあらかじめご了承下さい。</p><p>加えて、次の各号に掲げる内容を含むコメントは管理人の裁量によって承認せず、削除する事があります。</p><ul><li>特定の自然人または法人を誹謗し、中傷するもの</li><li>極度にわいせつな内容を含むもの</li><li>・禁制品の取引に関するものや、他者を害する行為の依頼など、法律によって禁止されている物品、行為の依頼や斡旋などに関するもの</li><li>その他、公序良俗に反し、または管理人によって承認すべきでないと認められるもの</li></ul>"

const disclaimer = "<h2>免責事項</h2><p>当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。</p><p>権利を侵害する目的ではございません。</p><p>記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が直接メールでご連絡下さい。</p><p>確認後、対応させて頂きます。</p><p>当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p><p>当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。</p><p>当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>"


const validate = Yup.object({
    domain: Yup.string().max(100, "ドメインにしては長すぎます").required("対象のドメインを入力して下さい")
})
const PrivacyPolicyMaker = ({transferPage}) => {
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        transferPage()
    }, [])
    const resetHTML = () => {
        const container = document.getElementById("privacyContainer")
        container.innerHTML = ""
        container.textContent = ""
    }
    return (
        <>
            <Formik
                initialValues = {{
                    "domain":"",
                    "analytics":true,
                    "html":false,
                }}
                validationSchema={validate}
                onSubmit = {(values, actions, ...props) => {
                    resetHTML()
                    setLoading(true)
                    const purpose = purpose_make(values.domain)
                    let full_sentence;
                    if (values.analytics){
                        full_sentence = purpose + disclosure + googleAnalytics + comment + disclaimer
                        console.log(full_sentence)
                    } else{
                        full_sentence = purpose + disclosure + comment + disclaimer
                    }
                    const container = document.getElementById("privacyContainer")
                    if (!values.html){
                        container.innerHTML = full_sentence
                    } else{
                        container.textContent = full_sentence
                    }
                    actions.resetForm({
                        values: {
                            domain:"",
                            analytics:true,
                            html:false,
                        }
                    })
                    }
                }
            >{({ values }) => (
                <div className="policy-maker-container">
                    <h1>プライバシーポリシーテンプレート自動生成アプリ</h1>
                    <div className="form-container">
                        <Form action="">
                            <Field
                                name="domain"
                                type="text"
                                placeholder="ドメイン名を入力：例）example.com"
                                className="form-control my-3"
                            >
                            </Field>
                            <div className="text-danger mb-3">
                                <ErrorMessage name="domain" />
                            </div>
                            <label>
                                <Field type="checkbox" name="analytics" className="check" />
                                Google Analyticsを使う（使わない場合はチェックを外す）
                            </label>
                            <label>
                                <Field type="checkbox" name="html" className="check" />
                                HTMLコードを表示
                            </label>
                            <p class="note">※あくまでも雛形となります。使用するサイトに合わせて各々調整してください。</p>
                            <button className="btn btn-primary form-control my-3" type="submit">生成する</button>
                        </Form>
                    </div>
                    <hr />
                    <div className="privacy-container my-4" id="privacyContainer">

                    </div>
                </div>
            )
            }
            </Formik>        
        </>
    )
}

export default PrivacyPolicyMaker

//何を載せるか？
//