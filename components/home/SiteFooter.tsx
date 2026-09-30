import Link from "next/link";
import styles from "./home.module.css";

/**
 * The green-pattern site footer shared by the Wix-built pages. `tight` is the
 * shop page's variant, which Wix lays out with smaller gaps under the headings.
 */
export default function SiteFooter({ tight = false }: { tight?: boolean }) {
  return (
    <footer
      id="help"
      className={`${styles.section} ${styles.footer} ${tight ? styles.footerTight : ""}`}
    >
      <div className={styles.footerGrid}>
        <div className={`${styles.footerCol} ${styles.fHelp}`}>
          <p>HAVE A QUESTION?</p>
          <p>EXPLORE OUR HELP CENTER</p>
          <a href="mailto:info@creativecollective.africa" className={styles.viewMore}>
            VIEW MORE
          </a>
        </div>
        <div className={`${styles.footerCol} ${styles.fShop}`}>
          <p>
            <Link href="/shop">SHOP</Link>
          </p>
          <div>
            <p>
              <Link href="/shop/products">ALL PRODUCTS</Link>
            </p>
            <p>
              <Link href="/shop/products">BEST SELLERS</Link>
            </p>
            <p>
              <Link href="/shop/products">SALE</Link>
            </p>
          </div>
        </div>
        <div className={`${styles.footerCol} ${styles.fContact}`}>
          <p>CONTACT</p>
          <div>
            <p className={styles.email}>
              <a href="mailto:info@creativecollective.africa">info@creativecollective.africa</a>
            </p>
            <p>
              <a href="tel:+2349161467262">+234-916-146-7262</a>
            </p>
          </div>
        </div>
        <div className={`${styles.footerCol} ${styles.fFollow}`}>
          <p>FOLLOW</p>
          <div>
            <p>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                INSTAGRAM
              </a>
            </p>
            <p>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                FACEBOOK
              </a>
            </p>
            <p>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                TIKTOK
              </a>
            </p>
            <p>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                YOUTUBE
              </a>
            </p>
          </div>
        </div>
        <div className={`${styles.footerCol} ${styles.fLegal}`}>
          <p>
            <Link href="/">LEGAL</Link>
          </p>
          <div>
            <p>
              <Link href="/">TERMS &amp; CONDITIONS</Link>
            </p>
            <p>
              <Link href="/">PRIVACY POLICY</Link>
            </p>
            <p>
              <Link href="/">SHIPPING POLICY</Link>
            </p>
            <p>
              <Link href="/">REFUND POLICY</Link>
            </p>
            <p>
              <Link href="/">ACCESSIBILITY STATEMENT</Link>
            </p>
          </div>
        </div>
        <p className={styles.copyright}>© 2026 CREATIVE COLLECTIVE AFRICA</p>
      </div>
    </footer>
  );
}
