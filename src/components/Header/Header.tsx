import Link from "next/link";
import styles from "./Header.module.css";
import Button from "../Button/Button";
import Divider from "../Decorative/Divider";

export default function Header() {
  return (
    <header className={styles.root}>
      <div className="padding_3_4 flow_tb_2_5">
        <Divider />
        <div className="flow_rl_space">
          {/* Linke Seite */}
          <div className="flow_rl_2_5">
            <Button
              dynamic
              aria-label="Menü öffnen"
              aria-controls="site-menu"
              aria-expanded="false"
            >
              Menü
            </Button>
          </div>

          {/* Rechte Seite */}
          <div className="flow_rl_2_5">
            <Button dynamic aria-label="Kontaktformular öffnen">Kontakt</Button>
          </div>
        </div>
      </div>
    </header>
  );
} 